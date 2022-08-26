import { collection, orderBy, query, where } from "firebase/firestore";
import { IFoodEntry, ISiteUser, IUserRoles } from "src/app/redux-slices/sweetSlice";
import {
  firebaseDb_addDoc,
  firebaseDb_getDoc_byPath,
  firebaseDb_getCollection_byQuery,
  firebaseDb_updateDoc_byPath,
  createUser,
  login,
  logout,
  tySimpleDoc_withoutId,
  ISimpleDoc_withId,
  sendResetPassword,
  generateUnsubscribeOnOneDocChange,
  generateUnsubscribeOnAuthChange,
  deleteOneUser_byAdminSdk,
  createOneUser_byAdminSdk,
  updateOneUser_byAdminSdk,
  verifyPassword,
  firebaseDb_deleteDoc_byPath,
} from "./firebase/api";
import { db } from "./firebase/config";

enum cEnum {
  users = "users",
  foodlist = "foodlist",
}

export interface IFoodWithAuthor extends IFoodEntry {
  author: ISiteUser;
}

export const dbApi = {
  /*
  addDoc: firebaseDb_addDoc,

  getBooksOfPatrick: async () => {
    const myItems = await firebaseDb_getCollection_byQuery(
      query(
        collection(db, "/", "books"),
        where("author", "==", "Patrick Rothfuss"),
        orderBy("tist", "asc"),
      ),
    );

    return myItems;
  },

  getAllbooks: async () => {
    const myItems = await firebaseDb_getCollection_byQuery(
      query(
        collection(db, "/", "books"),
        // where("author", "==", "Patrick Rothfuss"),
        // orderBy("tist", "asc"),
      ),
    );

    return myItems;
  },

  updateOneBook: async () => {
    const idOfupdated = await firebaseDb_updateDoc_byPath(["books", "6afuR5Toy0FjZ95h9HCi"], {
      title: "------",
    });
    return idOfupdated;
  },

  */

  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------
  // -------------------

  createUser_thenLoginInIt: async ({
    email,
    password,
    firstName,
    lastName,
    roles,
    created,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    created: number;
    roles: IUserRoles;
  }) => {
    const userAuth = await createUser(email, password);
    const userId = userAuth.user.uid;

    const objToSend: tySimpleDoc_withoutId = {
      email,
      firstName,
      lastName,
      created,
      roles: { ...roles },
    };

    const idOfNewUser = await firebaseDb_addDoc([cEnum.users, userId], objToSend);
    return idOfNewUser;
  },

  login: async (email: string, password: string) => {
    return login(email, password);
  },

  logout: async () => {
    return logout();
  },

  resetMyPassword: async (email: string) => {
    sendResetPassword(email);
  },

  verifyPassword: verifyPassword,

  //============
  deleteOneUser: deleteOneUser_byAdminSdk,
  createOneUser: createOneUser_byAdminSdk,
  updateOneUser: updateOneUser_byAdminSdk,
  //============

  getOneUserFromDb: async (userId: string) => {
    const userDoc = (await firebaseDb_getDoc_byPath([cEnum.users, userId])) as ISiteUser | null;
    return userDoc;
  },

  getOneUserByMail: async (mail: string) => {
    const myItems: ISiteUser[] = (await firebaseDb_getCollection_byQuery(
      query(
        collection(db, "/", cEnum.users),
        where("email", "==", mail),
        // orderBy("tist", "asc"),
      ),
    )) as any;

    if (!myItems || myItems.length === 0) {
      return null;
    }

    const userDoc = myItems[0];
    return userDoc;
  },

  getAllUsersFromDb: async () => {
    const myItems = await firebaseDb_getCollection_byQuery(
      query(
        collection(db, "/", cEnum.users),
        // where("author", "==", "Patrick Rothfuss"),
        // orderBy("tist", "asc"),
      ),
    );

    const truthyArr = myItems.filter((x) => !!x) as ISimpleDoc_withId[];
    const finalArr = truthyArr as any as ISiteUser[];

    return finalArr;
  },

  makeUserAdmin: async (userId: string, make: boolean) => {
    const userDoc = (await firebaseDb_getDoc_byPath([cEnum.users, userId])) as ISiteUser | null;

    if (!userDoc) {
      return null;
    }

    const newFields = { roles: { ...userDoc.roles, admin: make } };

    return await firebaseDb_updateDoc_byPath([cEnum.users, userId], newFields);
  },

  generateUnsubscribeForOneUserDoc: (
    userId: string,
    fnForChange: (updatedDoc: ISiteUser | null) => any,
  ) => {
    const unsub = generateUnsubscribeOnOneDocChange([cEnum.users, userId], fnForChange as any);
    return unsub;
  },

  generateUnsubscribeOnAuthChange: generateUnsubscribeOnAuthChange,

  createOneFood: async (data: Omit<IFoodEntry, "id">) => {
    const newId = await firebaseDb_addDoc([cEnum.foodlist], data);
    return newId;
  },

  updateOneFood: async (data: Omit<IFoodEntry, "authorId" | "created">) => {
    const withUndefinedId = { ...data, id: undefined };
    const cleaned = JSON.parse(JSON.stringify(withUndefinedId));

    const newId = await firebaseDb_updateDoc_byPath([cEnum.foodlist, data.id], cleaned);
    return newId;
  },

  deleteOneFood: async (id: string) => {
    const oldId = await firebaseDb_deleteDoc_byPath([cEnum.foodlist, id]);
    return oldId;
  },

  getEntireFoodListOfOneAuthor: async (authorId: string) => {
    const theRawList: IFoodEntry[] = (await firebaseDb_getCollection_byQuery(
      query(
        collection(db, "/", cEnum.foodlist),
        where("authorId", "==", authorId),
        // orderBy("created", "desc"),
      ),
    )) as any;

    const authorDoc = (await firebaseDb_getDoc_byPath([cEnum.users, authorId])) as ISiteUser | null;

    if (!authorDoc) {
      return null;
    }

    const finalArrayOfFood: IFoodWithAuthor[] = theRawList.map((food) => {
      return {
        ...food!,
        author: authorDoc,
      };
    });

    return finalArrayOfFood;
  },

  getEntireFoodListOfAllUsers: async () => {
    const entireListOfFoodOfAllUsers_raw: IFoodEntry[] = (await firebaseDb_getCollection_byQuery(
      query(collection(db, "/", cEnum.foodlist), orderBy("created", "desc")),
    )) as any;

    const entireListOfUsers: (ISiteUser | null)[] = (await firebaseDb_getCollection_byQuery(
      query(collection(db, "/", cEnum.users), orderBy("created", "desc")),
    )) as any;

    // ------------

    const hashMap_userId_userObj: { [id: string]: ISiteUser } = {};

    for (const user of entireListOfUsers) {
      if (user) {
        hashMap_userId_userObj[user.id] = user;
      }
    }

    // console.log("hashMap_userId_userObj:", hashMap_userId_userObj);

    const finalArrayOfFood: IFoodWithAuthor[] = entireListOfFoodOfAllUsers_raw.map((food) => {
      return {
        ...food!,
        author: hashMap_userId_userObj[food!.authorId],
      };
    });

    // console.log("jaaaaa:", finalArrayOfFood);

    return finalArrayOfFood;
  },

  // rateOneBike: async ({ bikeId, inputRating }: { bikeId: string; inputRating: IBikeRating }) => {
  //   const newFields = {
  //     rating: { ...inputRating },
  //   } as tySimpleDoc_withoutId;

  //   return await firebaseDb_updateDoc_byPath([cEnum.bikes, bikeId], newFields);
  // },

  // getAllBikes: async () => {
  //   const myItems = await firebaseDb_getCollection_byQuery(
  //     query(
  //       collection(db, "/", cEnum.bikes),
  //       // where("author", "==", "Patrick Rothfuss"),
  //       // orderBy("tist", "asc"),
  //     ),
  //   );

  //   const truthyArr = myItems.filter((x) => !!x) as ISimpleDoc_withId[];
  //   const finalArr = truthyArr as any as IBike[];

  //   return finalArr;
  // },

  // updateRentalsOfOneBike: async ({
  //   bikeId,
  //   inputRentalDays,
  // }: {
  //   bikeId: string;
  //   inputRentalDays: IRentalDay[];
  // }) => {
  //   const newFields = {
  //     rentalDays: inputRentalDays.map((x) => ({ ...x })),
  //   } as tySimpleDoc_withoutId;

  //   return await firebaseDb_updateDoc_byPath([cEnum.bikes, bikeId], newFields);
  // },
};
