const httpMocks = require('node-mocks-http');
const userController = require("../controllers/user");
const userService = require("../services/user");
const companyService = require('../services/company');
const roleService = require('../services/role');

jest.mock('../db/models', () => ({}));

const baseURL = "http://localhost:3000";

describe("User Controller", () => {
    beforeEach(() => {
        jest.spyOn(userService, 'update').mockResolvedValue();
        jest.spyOn(companyService, 'findByApiToken').mockResolvedValue(null);
        jest.spyOn(roleService, 'findAll').mockResolvedValue([]);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('User cget', () => {
        it("Should retrieve all users", async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${baseURL}/user`,
                user: {
                    companyId: 1
                }
            });

            const result = [
                {
                    id: 2,
                    lastname: "Admin",
                    firstname: "Super",
                    email: "superadmin@gmail.com",
                    password: "$2a$10$FFy/CzWs1y1x.4Yfn1m.k.53I8Oo9gFKyZTuZcEZ1.lsF5AGnIceG",
                    isValid: true,
                    createdAt: "2023-07-27T21:32:05.349Z",
                    updatedAt: "2023-07-27T21:32:05.349Z",
                    companyId: null,
                    roleId: 1,
                    Company: null,
                    Role: {
                        id: 1,
                        name: "admin",
                        createdAt: "2023-07-27T21:29:38.504Z",
                        updatedAt: "2023-07-27T21:29:38.504Z"
                    }
                },
                {
                    id: 15,
                    lastname: "test",
                    firstname: "test",
                    email: "karl+17bis@kmarques.dev",
                    password: "$2a$10$Df6gkmNqCvFhFnPafdTe8uJ5vAismwT4KzWTt4vMERprWZF.2T42W",
                    isValid: true,
                    createdAt: "2023-07-28T16:23:01.232Z",
                    updatedAt: "2023-07-28T16:28:40.506Z",
                    companyId: 17,
                    roleId: null,
                    Company: {
                        id: 17,
                        name: "Test",
                        kbis: "RCS-123456780",
                        address: "5 rue de la chance",
                        url: null,
                        apiToken: "fbf48d26-2071-44dd-a92b-cf6a8a23af19",
                        createdAt: "2023-07-28T16:23:01.219Z",
                        updatedAt: "2023-07-28T16:23:01.219Z"
                    },
                    Role: null
                },
            ];

            const res = httpMocks.createResponse();
            const next = jest.fn();
            jest.spyOn(userService, 'findAll').mockResolvedValue(result);

            await userController.cget(req, res, next);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(result);
            expect(userService.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('User get', () => {
        it("Should retrieve one user", async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${baseURL}/user/2`,
                params: {
                    id: 2
                },
                user: {
                    companyId: 1
                }
            });

            const result = {
                id: 2,
                lastname: "Admin",
                firstname: "Super",
                email: "superadmin@gmail.com",
                password: "$2a$10$FFy/CzWs1y1x.4Yfn1m.k.53I8Oo9gFKyZTuZcEZ1.lsF5AGnIceG",
                isValid: true,
                createdAt: "2023-07-27T21:32:05.349Z",
                updatedAt: "2023-07-27T21:32:05.349Z",
                companyId: null,
                roleId: 1,
                Company: null,
                Role: {
                    id: 1,
                    name: "admin",
                    createdAt: "2023-07-27T21:29:38.504Z",
                    updatedAt: "2023-07-27T21:29:38.504Z"
                }
            };

            const res = httpMocks.createResponse();
            const next = jest.fn();
            jest.spyOn(userService, 'findById').mockResolvedValue(result);

            await userController.get(req, res, next);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(result);
            expect(userService.findById).toHaveBeenCalledWith(2);
            expect(userService.findById).toHaveBeenCalledTimes(1);
        });

        it('Should return status 404 if the user is not found', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${baseURL}/user/100`,
                params: {
                    id: 100
                },
                user: {
                    companyId: 1
                }
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();
            jest.spyOn(userService, 'findById').mockResolvedValue(null);

            await userController.get(req, res, next);

            expect(res.statusCode).toBe(404);
            expect(userService.findById).toHaveBeenCalledWith(100);
            expect(userService.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('User get me', () => {
        it("Should retrieve one user", async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${baseURL}/user/me`,
                params: {
                    id: 2
                }
            });

            const result = {
                id: 2,
                lastname: "Admin",
                firstname: "Super",
                email: "superadmin@gmail.com",
                isValid: true,
                createdAt: "2023-07-27T21:32:05.349Z",
                updatedAt: "2023-07-27T21:32:05.349Z",
                companyId: null,
                roleId: 1,
                Company: null,
                Role: {
                    id: 1,
                    name: "admin",
                    createdAt: "2023-07-27T21:29:38.504Z",
                    updatedAt: "2023-07-27T21:29:38.504Z"
                }
            };

            const res = httpMocks.createResponse();
            const next = jest.fn();
            jest.spyOn(userService, 'findById').mockResolvedValue(result);

            await userController.get(req, res, next);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(result);
            expect(userService.findById).toHaveBeenCalledWith(2);
            expect(userService.findById).toHaveBeenCalledTimes(1);
        });

        it('Should return status 404 if the user is not found', async () => {
            const req = httpMocks.createRequest({
                method: 'GET',
                url: `${baseURL}/user/100`,
                params: {
                    id: 100
                }
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();
            jest.spyOn(userService, 'findById').mockResolvedValue(null);

            await userController.get(req, res, next);

            expect(res.statusCode).toBe(404);
            expect(userService.findById).toHaveBeenCalledWith(100);
            expect(userService.findById).toHaveBeenCalledTimes(1);
        });
    });

    describe('User post', () => {
        it('should create a user and return it', async () => {
            const role = {
                id: 1,
                name: 'admin',
                createdAt: '2023-07-29T12:34:56.789Z',
                updatedAt: '2023-07-29T12:34:56.789Z',
            };

            const newUser = {
                lastname: 'John',
                firstname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password',
                isValid: true,
                createdAt: '2023-07-29T12:34:56.789Z',
                updatedAt: '2023-07-29T12:34:56.789Z',
                roleId: role.id,
            };

            const req = httpMocks.createRequest({
                method: 'POST',
                url: `${baseURL}/user`,
                body: {
                    lastname: 'John',
                    firstname: 'Doe',
                    email: 'john.doe@example.com',
                    password: 'password',
                },
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();

            jest.spyOn(roleService, 'findAll').mockResolvedValue([role]);
            jest.spyOn(userService, 'create').mockResolvedValue(newUser);

            await userController.post(req, res, next);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toEqual(newUser);
            expect(roleService.findAll).toHaveBeenCalledWith({ name: 'admin' });
            expect(userService.create).toHaveBeenCalledWith({
                lastname: 'John',
                firstname: 'Doe',
                email: 'john.doe@example.com',
                password: 'password',
                isValid: true,
                roleId: role.id,
            });
            expect(userService.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('User patch', () => {
        it('should update a user and return it', async () => {
            const userId = 2;
            const updateUser = {
                firstname: 'Superrr',
            };

            const req = httpMocks.createRequest({
                method: 'PATCH',
                url: `${baseURL}/user/${userId}`,
                params: {
                    id: userId,
                },
                body: updateUser,
                user: {
                    id: userId,
                    isAdmin: true,
                },
            });

            const updatedUser = {
                id: 2,
                lastname: 'Admin',
                firstname: 'Superrr',
                email: 'superadmin@gmail.com',
                password: '$2a$10$FFy/CzWs1y1x.4Yfn1m.k.53I8Oo9gFKyZTuZcEZ1.lsF5AGnIceG',
                isValid: true,
                companyId: null,
                roleId: 1,
                createdAt: '2023-07-27T21:32:05.349Z',
                updatedAt: '2023-07-30T15:28:12.832Z',
            };

            const res = httpMocks.createResponse();
            const next = jest.fn();

            jest.spyOn(userService, 'update').mockResolvedValue([updatedUser]);

            await userController.patch(req, res, next);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual(updatedUser);
            expect(userService.update).toHaveBeenCalledWith(
                { id: userId },
                { firstname: 'Superrr' }
            );
            expect(userService.update).toHaveBeenCalledTimes(1);
        });

        it('should handle permission error and return status 403', async () => {
            const userId = 2;
            const updateUser = {
                firstname: 'Superrr',
            };

            const req = httpMocks.createRequest({
                method: 'PATCH',
                url: `${baseURL}/user/${userId}`,
                params: {
                    id: userId,
                },
                body: updateUser,
                user: {
                    id: 3,
                    isAdmin: false,
                },
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();

            await userController.patch(req, res, next);

            expect(res.statusCode).toBe(403);
            expect(res._isEndCalled()).toBeTruthy();
            expect(next).not.toHaveBeenCalled();
        });

        it('should handle user not found and return status 404', async () => {
            const userId = 2;
            const updateUser = {
                firstname: 'Superrr',
            };

            const req = httpMocks.createRequest({
                method: 'PATCH',
                url: `${baseURL}/user/${userId}`,
                params: {
                    id: userId,
                },
                body: updateUser,
                user: {
                    id: userId,
                    isAdmin: true,
                },
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();

            jest.spyOn(userService, 'update').mockResolvedValue([]);

            await userController.patch(req, res, next);

            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('User delete', () => {
        it('should delete a user and return 204 status', async () => {

            const req = httpMocks.createRequest({
                method: 'DELETE',
                url: `${baseURL}/user/2`,
                params: {
                    id: 2
                }
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();

            jest.spyOn(userService, 'remove').mockResolvedValue(true);

            await userController.delete(req, res, next);

            expect(res.statusCode).toBe(204);
            expect(res._isEndCalled()).toBeTruthy();
            expect(userService.remove).toHaveBeenCalledWith({"id": 2});
            expect(userService.remove).toHaveBeenCalledTimes(1);
        });

        it('should throw with status 404 if the user is not found', async () => {
            const req = httpMocks.createRequest({
                method: 'DELETE',
                url: `${baseURL}/user/999}`,
                params: {
                    id: 999,
                },
            });

            const res = httpMocks.createResponse();
            const next = jest.fn();

            jest.spyOn(userService, 'remove').mockResolvedValue(false);

            await userController.delete(req, res, next);

            expect(res.statusCode).toBe(404);
            expect(res._isEndCalled()).toBeTruthy();
            expect(userService.remove).toHaveBeenCalledWith({"id": 999});
            expect(userService.remove).toHaveBeenCalledTimes(1);
        });
    });

});
