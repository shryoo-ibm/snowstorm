import { addTest, inTable } from "@/app/model/Storm";


console.log("PAIN")

addTest("ZOS cmdb should be filled in", () => {
    console.log("pain");
    inTable("cmdb_ci").where("correlation_id", "=", "ID").where("correlation_id", "=", "noe").getField("operational_status").shouldEqual(1);
    inTable("cmdb_ci").where("correlation_id", "=", "ID").getNumberOfRecords().shouldBeGreaterThan(11);
    inTable("cmdb_ci").getNumberOfRecords().shouldBeGreaterThan(1);
})

addTest("DB2 subsystem is like somethiing else", () => {
    inTable("cmdb_ci").where("correlation_id", "=", "ID").where("correlation_id", "=", "noe").getField("operational_status").shouldEqual(1);
    inTable("cmdb_ci").where("correlation_id", "=", "ID").getNumberOfRecords().shouldBeGreaterThan(11);
    inTable("cmdb_ci").getNumberOfRecords().shouldBeGreaterThan(1);
});