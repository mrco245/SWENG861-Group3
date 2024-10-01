import userSlice, { signInStart, signInSuccess, signInFailure, updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOut } from "../../../redux/user/userSlice"
import { test, expect, describe } from 'vitest'


describe("UserSlice", () => {
    test('should return initial state', () => {
        expect(userSlice(undefined, { type: 'unknown' })).toEqual(
            {
                currentUser: null,
                loading: false,
                error: false
            }
        )
    })

    test('should handle signin starting', () => {

        expect(userSlice(undefined, signInStart())).toEqual(
            {
                currentUser: null,
                loading: true,
                error: false
            }
        )
    });

    test('should handle signin sucessful', () => {

        const testUser = {
            createdAt: "2024-09-29T00:36:38.129Z",
            email: "testuser@test.com",
            updatedAt: "2024-09-29T00:36:38.129Z",
            username: "testuser",
            __v: 0,
            _id: "66f8a11623a2d6fa6ca9fa1c",
        };

        expect(userSlice(undefined, signInSuccess(testUser))).toEqual(
            {
                currentUser: testUser,
                loading: false,
                error: false
            }
        )
    });

    test('should handle signin failed', () => {

        const error = {
            message: "error"
        };

        expect(userSlice(undefined, signInFailure(error))).toEqual(
            {
                currentUser: null,
                loading: false,
                error: error
            }
        )
    });

    test('should handle update start', () => {
        expect(userSlice(undefined, updateUserStart())).toEqual(
            {
                currentUser: null,
                loading: true,
                error: false
            }
        )
    });

    test('should handle update sucessful', () => {

        const testUser = {
            createdAt: "2024-09-29T00:36:38.129Z",
            email: "testuser@test.com",
            updatedAt: "2024-09-29T00:36:38.129Z",
            username: "testuser",
            __v: 0,
            _id: "66f8a11623a2d6fa6ca9fa1c",
        };

        expect(userSlice(undefined, updateUserSuccess(testUser))).toEqual(
            {
                currentUser: testUser,
                loading: false,
                error: false
            }
        )
    });


    test('should handle update failed', () => {

        const error = {
            message: "error"
        };

        expect(userSlice(undefined, updateUserFailure(error))).toEqual(
            {
                currentUser: null,
                loading: false,
                error: error
            }
        )
    });


    test('should handle delete user start', () => {
        expect(userSlice(undefined, deleteUserStart())).toEqual(
            {
                currentUser: null,
                loading: true,
                error: false
            }
        )
    });

    test('should handle delete user success', () => {
        expect(userSlice(undefined, deleteUserSuccess())).toEqual(
            {
                currentUser: null,
                loading: false,
                error: false
            }
        )
    });

    test('should handle delete user failed', () => {

        const error = {
            message: "error"
        };

        expect(userSlice(undefined, deleteUserFailure(error))).toEqual(
            {
                currentUser: null,
                loading: false,
                error: error
            }
        )
    });

    test('should handle signout', () => {
        expect(userSlice(undefined, signOut())).toEqual(
            {
                currentUser: null,
                loading: false,
                error: false
            }
        )
    });
});