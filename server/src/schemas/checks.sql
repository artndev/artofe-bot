CREATE TABLE Checks(
    ReferenceId VARCHAR(255) NOT NULL,
    LineItems TEXT NOT NULL,
    TotalPrice VARCHAR(50) NOT NULL,
    UserId VARCHAR(255) NOT NULL,
    PRIMARY KEY(ReferenceId, UserId),
    CONSTRAINT UserIdFK_3 FOREIGN KEY(UserId) REFERENCES UsersArtofe(Id)
);