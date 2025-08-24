from pydantic import BaseModel

class ResumeInput(BaseModel):
    job_description: str

class ResumeOutput(BaseModel):
    id: int
    customized_content: str