const url = new URL(process.env.DATABASE_URL!);
url.searchParams.delete('sslmode');

const ca = process.env.DATABASE_CA_CERTIFICATE
  ? Buffer.from(process.env.DATABASE_CA_CERTIFICATE, 'base64').toString()
  : undefined;

export const databaseConnection = {
  connectionString: url.toString(),
  ssl: ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: true },
};
