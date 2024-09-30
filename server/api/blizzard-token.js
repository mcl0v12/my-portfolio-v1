// server/api/blizard-token.js

export default defineEventHandler(async () => {
  try {
    const config = useRuntimeConfig();

    const authResponse = await $fetch('https://eu.battle.net/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }),
    });

    if (!authResponse.access_token) {
      throw new Error('Failed to retrieve access token');
    }

    return { access_token: authResponse.access_token };
  } catch (error) {
    console.error('Error fetching access token:', error);
    return { error: 'Failed to retrieve access token' };
  }
});
