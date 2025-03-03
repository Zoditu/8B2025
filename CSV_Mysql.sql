//Importar CSV a una tabla
LOAD DATA INFILE 'C:/tmp/export_file.txt' INTO TABLE Alumnos.Alumno
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';

//Exportar CSV de una tabla
SELECT * FROM Alumnos.Alumno
INTO OUTFILE 'C:/tmp/export_file.txt'
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n';