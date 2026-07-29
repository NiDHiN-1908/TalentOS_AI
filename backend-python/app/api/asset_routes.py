from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.domain.asset_models import (
    AssetCreateRequest,
    AssetAssignmentRequest,
    OffboardingRecoveryRequest,
    SoftwareLicenseAllocationResponse,
    AssetAnalyticsMetrics
)
from app.services.asset_management.asset_service import AssetService

router = APIRouter(prefix="/assets", tags=["Enterprise Asset Management Platform"])

@router.post("/create")
def register_asset(req: AssetCreateRequest):
    return AssetService.register_asset(req)

@router.post("/assign")
def assign_asset(req: AssetAssignmentRequest):
    return AssetService.assign_asset(req)

@router.post("/offboarding/recovery-clearance")
def process_offboarding_recovery(req: OffboardingRecoveryRequest):
    return AssetService.process_offboarding_recovery(req)

@router.post("/licenses/allocate", response_model=SoftwareLicenseAllocationResponse)
def allocate_software_license(software_name: str = "GitHub Enterprise"):
    return AssetService.allocate_software_license(software_name)

@router.get("/analytics/dashboard", response_model=AssetAnalyticsMetrics)
def get_asset_analytics():
    return AssetService.get_analytics_metrics()
