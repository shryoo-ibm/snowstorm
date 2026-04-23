export const fetchTable = async (tableName: string, queryString: string) => {
    const res = await fetch(`${process.env.SNOW_INSTANCE}api/now/table/${tableName}?sysparm_query=${queryString}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(`${process.env.SNOW_USERNAME}:${process.env.SNOW_PASSWORD}`)
        }
    });
    const data = await res.json();
    return data?.result;
};