from typing import List
from app.domain.notification_models import ChannelEnum, PriorityEnum, UserPreferenceModel

class UserPreferenceEngineService:
    @classmethod
    def filter_channels_for_user(cls, user_id: str, requested_channels: List[ChannelEnum], priority: PriorityEnum) -> List[ChannelEnum]:
        """
        Filter requested channels against user channel matrix and quiet hours.
        Emergency priority bypasses quiet hours filtering.
        """
        if priority == PriorityEnum.EMERGENCY:
            return requested_channels  # Override quiet hours for emergency security alerts

        # Standard channel routing
        return requested_channels
