# backend/alembic/env.py
from alembic import context
from logging.config import fileConfig
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

from sqlalchemy import engine_from_config
from sqlalchemy import pool

# Import your Base model from where it's defined
from app.models.db_models import Base

# Load .env file from the backend directory (one level up)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the target_metadata for autogenerate support
target_metadata = Base.metadata

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = os.getenv("DATABASE_URL")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


# In backend/alembic/env.py

def run_migrations_online() -> None:
    """Run migrations in 'online' mode."""

    # Build the URL from individual env vars for safety
    db_user = os.getenv("DB_USER", "postgres")
    # URL-encode the password
    db_password = quote_plus(os.getenv("DB_PASSWORD", "")) 
    db_host = os.getenv("DB_HOST", "localhost")
    db_port = os.getenv("DB_PORT", "5432")
    db_name = os.getenv("DB_NAME", "resume_db")

    # Construct the final URL from environment variables
    url = f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    # Create a configuration dictionary and pass our URL directly to it.
    # This bypasses the interpolation error from alembic.ini.
    connectable = engine_from_config(
        {"sqlalchemy.url": url}, # Use our constructed URL
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()