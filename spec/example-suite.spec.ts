import { addTest, inTable } from "@/app/model/Storm";


console.log("PAIN")

addTest("DB2 Subsystem data should be correctly filled in", () => {
    inTable("cmdb_ci_db_db2_instance").getNumberOfRecords().shouldEqual(3);
    inTable("cmdb_ci_db_db2_instance").where("correlation_id", "is", "IBM-8561-000000000003C8D8-TIVLP11-LP11-MCMPLEX1-DC11-LP11-DB2Subsystem").getField("operational_status").shouldEqual(1);
    inTable("cmdb_ci_db_db2_instance").where("name", "is", "DBWB").getField("operational_status").shouldEqual(2);
})

addTest("DB2 Database data should be correctly filled in", () => {
    inTable("cmdb_ci_db_db2_catalog").getNumberOfRecords().shouldEqual(52);
    inTable("cmdb_ci_db_db2_catalog").where("name", "is", "DSN00016").getField("last_discovered").shouldEqual("2025-04-15 15:49:19");
});

addTest("DB2 Database relationships should be correctly created", () => {
    inTable("cmdb_rel_ci").where("child.name", "is", "DSN00001").getNumberOfRecords().shouldBeGreaterThanOrEqualTo(1);
    inTable("cmdb_rel_ci").where("child.name", "is", "DSN00001").getNumberOfRecords().shouldEqual(10);
});