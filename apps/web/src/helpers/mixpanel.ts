export const sendToMixpanel = async (
  eventName: string,
  eventProperties?: Record<string, unknown>,
) => {
  // Get the current origin for the absolute URL
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  // Construct absolute URLs
  const proxyUrl = new URL('/api/proxy', origin);
  const mixpanelUrl = new URL('/api/mixpanel', origin);

  const locationResponse = await fetch(proxyUrl.toString());
  const locationData = await locationResponse.json();

  //this part of code handles getting the UTM parameters that we can't get by default server side
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    id: urlParams.get('id') || undefined,
  };

  //In my application I'm not authenticating users, so here I'm using uuid library to assign a random id that I will assign to users based on their session, if you are authenticating users you will have to do some additional steps
  //More info here: https://docs.mixpanel.com/docs/tracking-methods/id-management/identifying-users

  //Here we are including additional data that will be sent to Mixpanel like device information, UTM parameters and location
  const additionalProperties = {
    $browser: navigator.userAgent,
    $browser_version: navigator.appVersion,
    $city: locationData.city,
    $region: locationData.region_name,
    mp_country_code: locationData.country_name,
    $current_url: window.location.href,
    $device: navigator.platform,
    $device_id: navigator.userAgent,
    $initial_referrer: document.referrer ? document.referrer : undefined,
    $initial_referring_domain: document.referrer ? new URL(document.referrer).hostname : undefined,
    $os: navigator.platform,
    $screen_height: window.screen.height,
    $screen_width: window.screen.width,
    ...utmParams,
  };
  const properties = {
    ...eventProperties,
    ...additionalProperties,
  };

  await fetch(mixpanelUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      event: eventName,
      properties: properties,
    }),
  });
};
