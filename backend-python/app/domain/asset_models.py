from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class AssetTypeEnum(str, Enum):
    LAPTOP = "LAPTOP"
    DESKTOP = "DESKTOP"
    MONITOR = "MONITOR"
    MOBILE_PHONE = "MOBILE_PHONE"
    ACCESS_CARD = "ACCESS_CARD"
    SOFTWARE_LICENSE = "SOFTWARE_LICENSE"

class AssetStatusEnum(str, Enum):
    AVAILABLE = "AVAILABLE"
    ASSIGNED = "ASSIGNED"
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE"
    PENDING_RECOVERY = "PENDING_RECOVERY"
    RETIRED = "RETIRED"

class AssetCreateRequest(BaseModel):
    asset_name: str = Field(..., example="MacBook Pro 16 M3 Max")
    asset_type: AssetTypeEnum = AssetTypeEnum.LAPTOP
    serial_number: str = Field(..., example="C02G1004MD6M")
    purchase_cost: float = Field(..., example=3499.0)
    purchase_date: str = Field(..., example="2026-01-15")
    tenant_id: Optional[str] = Field(default="TNT-TALENTOS-01")

class AssetAssignmentRequest(BaseModel):
    asset_id: str
    assigned_to_employee_id: str = Field(..., example="EMP-101")
    assigned_by_user_id: str = Field(default="USR-101")

class OffboardingRecoveryRequest(BaseModel):
    employee_id: str = Field(..., example="EMP-101")
    asset_ids: List[str]
    hardware_condition: str = Field(default="EXCELLENT") # EXCELLENT / DAMAGED / MISSING
    data_wipe_executed: bool = True

class SoftwareLicenseAllocationResponse(BaseModel):
    license_id: str
    software_name: str = Field(..., example="GitHub Enterprise")
    allocated_seats: int = 150
    active_seats_used: int = 120
    unused_seats_revoked: int = 10
    cost_savings: float = 1200.0

class AssetAnalyticsMetrics(BaseModel):
    total_asset_count: int = 1250
    total_inventory_value: float = 1845000.0
    assignment_rate_pct: float = 94.2
    offboarding_recovery_rate_pct: float = 99.1
    active_warranties_count: int = 890
