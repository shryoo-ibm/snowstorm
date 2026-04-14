export const fetchTest = async () => {
    console.log("pain")
    const res = await fetch("https://dev352735.service-now.com/api/now/table/cmdb_ci", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(`admin:x7XzNAE!pq6*`)
        }
    })
    const data = await res.json();
    console.log("res", data.result);
    return data.result;
}

const process = {
    env: {
        SNOW_INSTANCE: "https://dev352735.service-now.com/",
        SNOW_USERNAME: "admin",
        SNOW_PASSWORD: "x7XzNAE!pq6*"
    }
}

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