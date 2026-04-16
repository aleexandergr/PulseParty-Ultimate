export async function getGeoByIp(ip) {
  try {
    const base = process.env.IPINFO_TOKEN
      ? `https://ipinfo.io/${ip}?token=${process.env.IPINFO_TOKEN}`
      : `https://ipinfo.io/${ip}/json`;
    const response = await fetch(base);
    const data = await response.json();
    return {
      countryCode: data.country || 'UN',
      countryName: data.country || 'Unknown',
    };
  } catch {
    return { countryCode: 'UN', countryName: 'Unknown' };
  }
}
