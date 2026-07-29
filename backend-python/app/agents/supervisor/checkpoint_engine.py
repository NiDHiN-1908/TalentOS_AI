import time
from typing import Dict, Any, Optional
from app.agents.supervisor.models import CheckpointRecord, SupervisorStateModel

class CheckpointEngineService:
    """
    Transactional Checkpointing & Crash Recovery Engine
    Persists transactional state snapshots before and after every graph node transition.
    """
    checkpoints_db: Dict[str, CheckpointRecord] = {}

    @classmethod
    def create_checkpoint(cls, state: SupervisorStateModel) -> CheckpointRecord:
        checkpoint_id = f"CHK-{state.dag_id}-{state.current_step_index}-{int(time.time() * 1000)}"
        record = CheckpointRecord(
            checkpoint_id=checkpoint_id,
            dag_id=state.dag_id,
            tenant_id=state.tenant_id,
            step_index=state.current_step_index,
            state_snapshot=state.model_dump(),
            created_at=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )
        cls.checkpoints_db[checkpoint_id] = record
        state.checkpoint_id = checkpoint_id
        return record

    @classmethod
    def get_checkpoint(cls, checkpoint_id: str) -> Optional[CheckpointRecord]:
        return cls.checkpoints_db.get(checkpoint_id)

    @classmethod
    def rollback_to_checkpoint(cls, checkpoint_id: str) -> SupervisorStateModel:
        record = cls.checkpoints_db.get(checkpoint_id)
        if not record:
            raise ValueError("Checkpoint record not found.")
        return SupervisorStateModel(**record.state_snapshot)
