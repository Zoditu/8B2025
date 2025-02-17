const Process = require('./utils/Process');
const sleep = require('./utils/sleep');

const metricas = {
    mysql: {
        export: null,
        drop: null,
        import: null
    },
    mongo: {
        export: null,
        drop: null,
        import: null
    }
};

(async () => {
    const mysqldump = new Process("mysqldump");
    mysqldump.ProcessArguments.push("-uroot");
    mysqldump.ProcessArguments.push("--password=utt");
    mysqldump.ProcessArguments.push("Alumnos");
    mysqldump.ProcessArguments.push("--result-file=alumnos.sql");
    await mysqldump.ExecuteAsync(true);
    console.log(`[mysqldump] Tiempo total: ${mysqldump.EndTime - mysqldump.StartTime} ms`);
    metricas.mysql.export = mysqldump.EndTime - mysqldump.StartTime;

    const dropMysql = new Process("mysql"); 
    dropMysql.ProcessArguments.push("-uroot");
    dropMysql.ProcessArguments.push("--password=utt");
    dropMysql.Execute();
    dropMysql.Write("drop database Alumnos;");
    dropMysql.Write("create database Alumnos;");
    dropMysql.End();
    await dropMysql.Finish();
    console.log(`[dropMysql] Tiempo total: ${dropMysql.EndTime - dropMysql.StartTime} ms`);
    metricas.mysql.drop = dropMysql.EndTime - dropMysql.StartTime;


    const mysql = new Process("mysql", {
        shell: true
    });
    mysql.ProcessArguments.push("-uroot");
    mysql.ProcessArguments.push("--password=utt");
    mysql.ProcessArguments.push(" Alumnos < alumnos.sql");
    await mysql.ExecuteAsync(true);
    console.log(`[mysqlimport] Tiempo total: ${mysql.EndTime - mysql.StartTime} ms`);
    metricas.mysql.import = mysql.EndTime - mysql.StartTime;

    /*********************Mongo*************************/
    const mongoexport = new Process("mongoexport");
    mongoexport.ProcessArguments.push("--collection=Alumno");
    mongoexport.ProcessArguments.push("--db=Alumnos");
    mongoexport.ProcessArguments.push("--out=alumnos.json");
    await mongoexport.ExecuteAsync(true);
    console.log(`[mongoexport] Tiempo total: ${mongoexport.EndTime - mongoexport.StartTime} ms`);
    metricas.mongo.export = mongoexport.EndTime - mongoexport.StartTime;


    const dropMongo = new Process("mongosh"); 
    dropMongo.Execute();
    dropMongo.Write("use Alumnos;");
    dropMongo.Write("\n");
    dropMongo.Write("db.Alumno.drop();");
    dropMongo.End();
    await dropMongo.Finish();
    console.log(`[dropMongo] Tiempo total: ${dropMongo.EndTime - dropMongo.StartTime} ms`);
    metricas.mongo.drop = dropMongo.EndTime - dropMongo.StartTime;


    const mongoimport = new Process("mongoimport");
    mongoimport.ProcessArguments.push("--collection=Alumno");
    mongoimport.ProcessArguments.push("--db=Alumnos");
    mongoimport.ProcessArguments.push("alumnos.json");
    await mongoimport.ExecuteAsync(true);
    console.log(`[mongoimport] Tiempo total: ${mongoimport.EndTime - mongoimport.StartTime} ms`);
    metricas.mongo.import = mongoimport.EndTime - mongoimport.StartTime;

    //Imprimir métricas
    console.log(metricas);

})();