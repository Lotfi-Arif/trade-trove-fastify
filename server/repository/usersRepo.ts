import type { UserModel } from 'commonTypesWithClient/models';
import type { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { userIdParser } from 'service/idParsers';

export const usersRepo = {
  recordToModel: (user: UserRecord): UserModel => {
    // Parse the required fields from the UserRecord
    const id = userIdParser.parse(user.uid); // Assuming the Prisma User ID is the Firebase UID
    const email = user.email ?? '';
    const displayName = user.displayName ?? '';
    const photoURL = user.photoURL ?? '';
    const firebaseUid = user.uid; // Firebase UID

    // Construct a UserModel object with the necessary fields
    // Note: createdAt, updatedAt, deletedAt, and profile are not available from UserRecord and are set to default or optional values
    const userModel: UserModel = {
      id,
      firebaseUid,
      email,
      displayName,
      photoURL,
      createdAt: new Date(), // Set to current date/time or fetch from your database if needed
      updatedAt: new Date(),
      // Set deletedAt to null or undefined as it's not available from UserRecord
      deletedAt: null,
      // Assume no profile info is available from the UserRecord; handle profile creation separately if needed
      profile: null,
    };

    return userModel;
  },
};
