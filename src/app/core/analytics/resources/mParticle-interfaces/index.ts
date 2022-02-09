export type UserAttributesValue = string | number | boolean | null;

export type MPID = string;

export type AllUserAttributes = Record<string, UserAttributesValue | UserAttributesValue[]>;

export interface UserIdentities {
  customerid?: string | undefined;
  email?: string | undefined;
  other?: string | undefined;
  other2?: string | undefined;
  other3?: string | undefined;
  other4?: string | undefined;
  other5?: string | undefined;
  other6?: string | undefined;
  other7?: string | undefined;
  other8?: string | undefined;
  other9?: string | undefined;
  other10?: string | undefined;
  mobile_number?: string | undefined;
  phone_number_2?: string | undefined;
  phone_number_3?: string | undefined;
  facebook?: string | undefined;
  facebookcustomaudienceid?: string | undefined;
  google?: string | undefined;
  twitter?: string | undefined;
  microsoft?: string | undefined;
  yahoo?: string | undefined;
}

export interface mParticleUser {
  getUserIdentities: () => UserIdentities;
  getMPID: () => MPID;
  setUserTag: (tag: string) => void;
  removeUserTag: (tag: string) => void;
  setUserAttribute: (key: string, value: string) => void;
  setUserAttributes: (attributeObject: Record<string, unknown>) => void;
  removeUserAttribute: (key: string) => void;
  setUserAttributeList: (key: string, value: UserAttributesValue[]) => void;
  removeAllUserAttributes: () => void;
  getUserAttributesLists: () => Record<string, UserAttributesValue[]>;
  getAllUserAttributes: () => AllUserAttributes;
}
