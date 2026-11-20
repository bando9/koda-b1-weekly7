-- create database newEwallet;
-- GO

-- *Show tables in db
SELECT 
    SCHEMA_NAME(schema_id) AS SchemaName,
    name AS TableName,
    create_date,
    modify_date
FROM 
    sys.tables
ORDER BY 
    TableName;
GO


Select * FROM dbo.AuditLogs;
Select * FROM dbo.TopUpRequests;
Select * FROM dbo.WalletMutations; 
Select * FROM dbo.Transactions;
Select * FROM dbo.PaymentMethods;
Select * FROM dbo.Wallets;
Select * FROM dbo.Users; 