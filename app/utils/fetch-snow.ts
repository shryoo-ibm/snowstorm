const snowOptions: RequestInit = {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa(`${process.env.SNOW_USERNAME}:${process.env.SNOW_PASSWORD}`)
        }
    }

export const fetchTable = async (tableName: string, queryString: string) => {
    const res = await fetch(`${process.env.SNOW_INSTANCE}api/now/table/${tableName}?sysparm_query=${queryString}`, snowOptions);
    const data = await res.json();
    return data?.result;
};

export const fetchStats = async () => {
    const res = await fetchTable("sys_properties", "name=glide.war^ORname=instance_name");
    let instanceName;
    let instanceVersion;
    for (const record of res) {
        if (record.name == "instance_name") {
            instanceName = record.value;
        }
        if (record.name == "glide.war") {
            instanceVersion = record.value.replace(".zip", "");
        }
    }
    return {
        instanceName,
        instanceVersion
    };
}