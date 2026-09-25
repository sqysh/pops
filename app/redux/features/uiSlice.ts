import { Reducer, createSlice } from '@reduxjs/toolkit'

export interface UiStatePayload {
  contactSubmissionModal: boolean
  userDrawer: boolean
  campApplicationSuccessModal: boolean
}

export const initialUiState: UiStatePayload = {
  contactSubmissionModal: false,
  userDrawer: false,
  campApplicationSuccessModal: false
}

export const uiSlice = createSlice({
  name: 'ui',
  initialState: initialUiState,
  reducers: {
    setOpenContactSubmissionSuccessModal: (state) => {
      state.contactSubmissionModal = true
    },
    setCloseContactSubmissionSuccessModal: (state) => {
      state.contactSubmissionModal = false
    },
    setOpenCampApplicationSuccessModal: (state) => {
      state.campApplicationSuccessModal = true
    },
    setCloseCampApplicationSuccessModal: (state) => {
      state.campApplicationSuccessModal = false
    }
  }
})

export const uiReducer = uiSlice.reducer as Reducer<UiStatePayload>

export const {
  setCloseContactSubmissionSuccessModal,
  setOpenContactSubmissionSuccessModal,
  setCloseCampApplicationSuccessModal,
  setOpenCampApplicationSuccessModal
} = uiSlice.actions
