from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.resume_models import (
    ResumeParseRequest,
    ParsedResumeModel,
    SkillEntity,
    JobMatchRequest,
    JobMatchResponse,
    CandidateRankItem
)
from app.services.resume_intelligence.resume_parser import ResumeParserService
from app.services.resume_intelligence.candidate_ranker import CandidateRankerService

router = APIRouter(prefix="/resume", tags=["Enterprise Resume Intelligence Engine"])

@router.post("/parse", response_model=ParsedResumeModel)
def parse_resume(req: ResumeParseRequest):
    try:
        return ResumeParserService.parse_resume(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/skills/extract", response_model=List[SkillEntity])
def extract_resume_skills(req: ResumeParseRequest):
    parsed = ResumeParserService.parse_resume(req)
    return parsed.skills

@router.post("/match", response_model=JobMatchResponse)
def match_resume_to_job(req: JobMatchRequest):
    return CandidateRankerService.match_resume_to_job(req)

@router.post("/rank", response_model=List[CandidateRankItem])
def rank_candidates_for_job(candidate_texts: List[str], job_description: str):
    return CandidateRankerService.rank_candidates(candidate_texts, job_description)
