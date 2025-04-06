export enum CallType {
  OFFER = "OFFER",
  ANSWER = "ANSWER",
  ICE_CANDIDATE = "ICE_CANDIDATE",
}

export type CallMessage = {
  type: CallType
  offer?: RTCSessionDescriptionInit
  answer?: RTCSessionDescriptionInit
  candidate?: RTCIceCandidateInit
}
