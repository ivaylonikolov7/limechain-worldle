/**
 * Script to fetch all users from a Slack channel
 * 
 * Usage:
 * 1. Install dependencies: npm install @slack/web-api dotenv
 * 2. Create a .env file with: SLACK_BOT_TOKEN=xoxb-your-token
 * 3. Run: node scripts/fetch-slack-users.js <channel-id>
 * 
 * To get a Slack token:
 * 1. Go to https://api.slack.com/apps
 * 2. Create a new app or select existing one
 * 3. Go to "OAuth & Permissions"
 * 4. Add scopes: 
 *    - channels:read (for public channels)
 *    - groups:read (for private channels - REQUIRED for channels starting with G)
 *    - users:read
 *    - users:read.email
 *    - users.profile:read
 * 5. Install to workspace
 * 6. Copy the "Bot User OAuth Token" (starts with xoxb-)
 * 
 * IMPORTANT: For private channels (starting with G), you MUST add the "groups:read" scope!
 * 
 * To get channel ID:
 * - Right-click channel in Slack → View channel details → Copy channel ID
 * - Or use the channel name (e.g., #general) - script will try to resolve it
 */

import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const token = process.env.SLACK_BOT_TOKEN || process.env.SLACK_TOKEN;

if (!token) {
  console.error('Error: SLACK_BOT_TOKEN or SLACK_TOKEN not found in environment variables');
  console.error('Please add it to .env.local file');
  process.exit(1);
}

const slack = new WebClient(token);

async function getChannelId(channelInput) {
  // If it's already a channel ID (starts with C or G), return it
  if (channelInput.startsWith('C') || channelInput.startsWith('G')) {
    return channelInput;
  }
  
  // Try to resolve channel name
  try {
    const result = await slack.conversations.list({
      types: 'public_channel,private_channel,mpim,im'
    });
    
    const channel = result.channels.find(
      ch => ch.name === channelInput.replace('#', '') || ch.id === channelInput
    );
    
    if (channel) {
      return channel.id;
    }
    
    throw new Error(`Channel "${channelInput}" not found`);
  } catch (error) {
    console.error('Error finding channel:', error.message);
    throw error;
  }
}

async function getChannelMembers(channelId) {
  try {
    const result = await slack.conversations.members({
      channel: channelId
    });
    return result.members;
  } catch (error) {
    console.error('Error fetching channel members:', error.message);
    throw error;
  }
}

async function getUserInfo(userId) {
  try {
    const result = await slack.users.info({
      user: userId
    });
    return result.user;
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error.message);
    return null;
  }
}

async function fetchUsersFromChannel(channelInput) {
  try {
    console.log(`Fetching users from channel: ${channelInput}...`);
    
    // Get channel ID
    const channelId = await getChannelId(channelInput);
    console.log(`Channel ID: ${channelId}`);
    
    // Get channel members
    const memberIds = await getChannelMembers(channelId);
    console.log(`Found ${memberIds.length} members in channel`);
    
    // Fetch user details
    const users = [];
    for (const userId of memberIds) {
      const user = await getUserInfo(userId);
      if (user && !user.deleted && !user.is_bot) {
        users.push({
          id: user.id,
          name: user.real_name || user.name,
          displayName: user.display_name || user.real_name || user.name,
          email: user.profile?.email || '',
          imageUrl: user.profile?.image_72 || user.profile?.image_192 || user.profile?.image_512 || '',
          image72: user.profile?.image_72 || '',
          image192: user.profile?.image_192 || '',
          image512: user.profile?.image_512 || '',
          role: user.profile?.title || '?',
          status: user.profile?.status_text || ''
        });
      }
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\nFetched ${users.length} active users:\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.displayName}) - ${user.email || 'No email'}`);
    });
    
    // Save to JSON file
    const outputPath = 'employees/employees-chalga.json';
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ users }, null, 2),
      'utf-8'
    );
    
    console.log(`\n✅ Users exported to: ${outputPath}`);
    console.log(`\nNote: You'll need to manually add:`);
    console.log(`  - listens-to-chalga (boolean)`);
    console.log(`  - gender ("лаймче" or "лаймка")`);
    
    return users;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
    process.exit(1);
  }
}

// Get channel from command line argument
const channelInput = process.argv[2];

if (!channelInput) {
  console.error('Usage: node scripts/fetch-slack-users.js <channel-id-or-name>');
  console.error('Example: node scripts/fetch-slack-users.js C1234567890');
  console.error('Example: node scripts/fetch-slack-users.js general');
  process.exit(1);
}

fetchUsersFromChannel(channelInput);
