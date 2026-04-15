'use client';

import { useFormsPopupStore } from '@/features/forms/model/store';

import { CustomSolutionRequestPopup } from '../CustomSolutionRequestPopup/CustomSolutionRequestPopup';
import { RequestPopup } from '../RequestPopup/RequestPopup';

export function FormsPopupRenderer() {
  const popupType = useFormsPopupStore((state) => state.popupType);
  const requestName = useFormsPopupStore((state) => state.requestName);
  const closePopup = useFormsPopupStore((state) => state.closePopup);

  return (
    <>
      {popupType === 'request' && requestName && (
        <RequestPopup service={requestName} isOpen onClose={closePopup} onReturnHome={closePopup} />
      )}
      {popupType === 'custom-solution-request' && (
        <CustomSolutionRequestPopup isOpen onClose={closePopup} />
      )}
    </>
  );
}
