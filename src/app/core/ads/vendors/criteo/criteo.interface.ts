export interface CriteoLibrary {
  CallRTA: Function;
  ComputeStandaloneDFPTargeting: Function;
  DisplayAcceptableAdIfAdblocked: Function;
  DisplayAd: Function;
  GetBids: Function;
  GetBidsForAdUnit: Function;
  Passback: { RequestBids: Function; RenderAd: Function };
  PubTag: {
    Adapters: {
      AMP: Function;
      Prebid: Function;
    };
    Context: {
      GetIdfs: Function;
      SetIdfs: Function;
    };
    DirectBidding: {
      DirectBiddingEvent: Function;
      DirectBiddingSlot: Function;
      DirectBiddingUrlBuilder: Function;
      Size: Function;
    };
    RTA: {
      DefaultCrtgContentName: string;
      DefaultCrtgRtaCookieName: string;
    };
  };

  RenderAd: Function;
  RequestBids: Function;
  RequestBidsOnGoogleTagSlots: Function;
  SetCCPAExplicitOptOut: Function;
  SetCeh: Function;
  SetDFPKeyValueTargeting: Function;
  SetLineItemRanges: Function;
  SetPublisherExt: Function;
  SetSlotsExt: Function;
  SetTargeting: Function;
  SetUserExt: Function;
  events: { push: Function };
  passbackEvents: [];
  usePrebidEvents: boolean;
}
