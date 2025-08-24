from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.utils.db import Base

class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    base_content = Column(Text, nullable=False)
    customized_content = Column(Text, nullable=False)
    job_description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)