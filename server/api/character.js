// server/api/character.js

export default defineEventHandler(async (event) => {
    try {
      const { realm, name } = getQuery(event);
      const config = useRuntimeConfig();
  
      console.log('Fetching character profile for', realm, name);
  
      // Hol den Access Token
      const tokenResponse = await $fetch('/api/blizzard-token');
      const accessToken = tokenResponse.access_token;
  
      console.log('Access Token:', accessToken);
  
      // Charakterprofil und Medien abfragen + PvP Bracket Stats für 2v2 und 3v3
      const [mediaResponse, profileResponse, pvp2v2Response, pvp3v3Response] = await Promise.all([
        $fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}/character-media`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Battlenet-Namespace': 'profile-eu',
            },
            params: {
              locale: 'de_DE',
            },
          }
        ),
        $fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Battlenet-Namespace': 'profile-eu',
            },
            params: {
              locale: 'de_DE',
            },
          }
        ),
        $fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}/pvp-bracket/2v2`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Battlenet-Namespace': 'profile-eu',
            },
            params: {
              locale: 'de_DE',
            },
          }
        ),
        $fetch(
          `https://eu.api.blizzard.com/profile/wow/character/${realm}/${name.toLowerCase()}/pvp-bracket/3v3`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Battlenet-Namespace': 'profile-eu',
            },
            params: {
              locale: 'de_DE',
            },
          }
        ),
      ]);
  
      console.log('Character Media Response:', mediaResponse);
      console.log('Character Profile Response:', profileResponse);
      console.log('PvP 2v2 Bracket Response:', pvp2v2Response);
      console.log('PvP 3v3 Bracket Response:', pvp3v3Response);
  
      // Kombiniere die Medien-, Profil- und PvP-Daten
      const characterData = {
        ...mediaResponse,
        character: {
          ...profileResponse,
          achievement_points: profileResponse.achievement_points, // Erfolgspunkte hinzufügen
        },
        pvp: {
          '2v2': pvp2v2Response.rating, // Höchste Wertung für 2v2
          '3v3': pvp3v3Response.rating, // Höchste Wertung für 3v3
        },
      };
  
      return characterData;
    } catch (error) {
      console.error('Error fetching character data:', error);
      return { error: 'Failed to fetch character data' };
    }
  });
  