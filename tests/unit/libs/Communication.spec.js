import mockAxios from "jest-mock-axios";
import Communication from "@/libs/Communication";

const router = {
  push: jest.fn()
};

describe("Communication.js", () => {
  beforeEach(() => {
    Communication.init(router);
    if (localStorage.getItem("token") !== null) {
      localStorage.removeItem("token");
    }
  });
  afterEach(() => {
    mockAxios.reset();
    jest.clearAllMocks();
  });
  test("get simple", () => {
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.get("/test/url", onResponse, onError);
    mockAxios.mockResponse({
      data: { message: "Test" },
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalled();
    expect(onResponse.mock.calls[0][0].message).toEqual("Test");
    expect(onError).not.toHaveBeenCalled();
  });
  test("get error", () => {
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.get("/test/get", onResponse, onError);
    mockAxios.mockError({
      response: {
        status: 404
      }
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(onResponse).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0].status).toEqual(404);
  });
  test("get not connected", () => {
    localStorage.setItem("token", "temp");
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.get("/test/get", onResponse, onError);
    mockAxios.mockError({
      response: {
        status: 403
      }
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(onResponse).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(router.push).toHaveBeenCalled();
    expect(router.push.mock.calls[0][0]).toEqual("/login");
    expect(localStorage.getItem("token")).toBeNull();
  });
  test("post simple", () => {
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.post("/test/post", onResponse, onError);
    mockAxios.mockResponse({
      data: {},
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.post).toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
  test("post error", () => {
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.post("/test/post", onResponse, onError);
    mockAxios.mockError({
      response: {
        status: 404
      }
    });
    expect(mockAxios.post).toHaveBeenCalled();
    expect(onResponse).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
  test("post with options simple", () => {
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.postWithOptions("/test/post_option", { option: "TestOption" }, onResponse, onError);
    mockAxios.mockResponse({
      data: {},
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.post).toHaveBeenCalled();
    expect(mockAxios.post.mock.calls[0][1].get("option")).toEqual("TestOption");
    expect(onResponse).toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });
  test("post with options error", () => {
    let onResponse = jest.fn();
    let onError = jest.fn();
    Communication.postWithOptions("/test/post_option", { option: "TestOption" }, onResponse, onError);
    mockAxios.mockError({
      response: {
        status: 404
      }
    });
    expect(mockAxios.post).toHaveBeenCalled();
    expect(onResponse).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalled();
  });
  test("connect with good credentials", () => {
    localStorage.setItem("token", "OldToken");
    let onResponse = jest.fn();
    Communication.connect("user", "password", onResponse);
    mockAxios.mockResponse({
      data: { token: "ATestToken" },
      status: 200,
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalled();
    expect(onResponse.mock.calls[0][0]).toBeTruthy();
    expect(localStorage.getItem("token")).toEqual("ATestToken");
    expect(Communication.isConnected()).toBeTruthy();
  });
  test("connect with bad credentials", () => {
    localStorage.setItem("token", "OldToken");
    let onResponse = jest.fn();
    Communication.connect("user", "password", onResponse);
    mockAxios.mockError({
      response: {
        status: 400,
        data: "Bad credentials"
      },
      statusText: "OK"
    });
    expect(mockAxios.get).toHaveBeenCalled();
    expect(onResponse).toHaveBeenCalled();
    expect(onResponse.mock.calls[0][0]).toBeFalsy();
    expect(localStorage.getItem("token")).toBeNull();
    expect(Communication.isConnected()).toBeFalsy();
  });
});
