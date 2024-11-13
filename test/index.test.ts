import request from "supertest";
import { expect } from "chai";

import app from "../src/express.js";

async function makeGoodRequest(query: string) {
  const response = await request(app)
    .get(query)
    .expect(200)
    .expect("Content-Type", /json/);
  expect(response.body).to.be.an("array");
  return response;
}

async function makeBadRequest(query: string) {
  const response = await request(app)
    .get(query)
    .expect(400)
    .expect("Content-Type", /json/);
  expect(response.body).to.have.property("error");
  return response;
}

describe("Lessons API", () => {
  describe("GET /lessons", () => {
    it("should return a list of lessons", async () => {
      await makeGoodRequest("/lessons");
    });

    describe("Date check", () => {
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?date=2019-02-28");
      });

      it("should return an array", async () => {
        await makeGoodRequest("/lessons?date=2019-02-28,2019-03-28");
      });

      it("should return an error for non-existing date", async () => {
        const response = await makeBadRequest("/lessons?date=2019-02-31");

        expect(response.body.error).to.contain("Invalid date format");
      });

      it("should return an error for one non-existing date", async () => {
        const response = await makeBadRequest(
          "/lessons?date=2019-02-31,2019-03-31",
        );

        expect(response.body.error).to.contain("Invalid date format");
      });

      it("should return an error for one non-existing date", async () => {
        const response = await makeBadRequest(
          "/lessons?date=2019-02-31,2020-02-31",
        );

        expect(response.body.error).to.contain("Invalid date format");
      });
    });

    describe("Status check", () => {
      it("should return a 400 Bad Request for invalid status", async () => {
        const response = await makeBadRequest("/lessons?status=2");

        expect(response.body.error).to.contain("Invalid status");
      });
    });

    describe("Teacher ids check", () => {
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?teacherIds=1");
      });
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?teacherIds=1,4");
      });

      it("should return a 400 Bad Request for invalid teacherIds format", async () => {
        const response = await makeBadRequest("/lessons?teacherIds=abc");

        expect(response.body.error).to.contain("Invalid teacherIds format");
      });
      it("should return a 400 Bad Request for invalid teacherIds format", async () => {
        const response = await makeBadRequest("/lessons?teacherIds=abc,abc");

        expect(response.body.error).to.contain("Invalid teacherIds format");
      });
      it("should return a 400 Bad Request for invalid teacherIds format", async () => {
        const response = await makeBadRequest("/lessons?teacherIds=abc,2");

        expect(response.body.error).to.contain("Invalid teacherIds format");
      });
    });

    describe("Students count check", () => {
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?studentsCount=1");
      });
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?studentsCount=1,5");
      });

      it("should return a 400 Bad Request for invalid studentsCount format", async () => {
        const response = await makeBadRequest("/lessons?studentsCount=abc");

        expect(response.body.error).to.contain("Invalid studentsCount format");
      });
      it("should return a 400 Bad Request for invalid studentsCount format", async () => {
        const response = await makeBadRequest("/lessons?studentsCount=abc,abc");

        expect(response.body.error).to.contain("Invalid studentsCount format");
      });
      it("should return a 400 Bad Request for invalid studentsCount format", async () => {
        const response = await makeBadRequest("/lessons?studentsCount=abc,2");

        expect(response.body.error).to.contain("Invalid studentsCount format");
      });
    });

    describe("Page number check", () => {
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?page=1");
      });

      it("should return an array", async () => {
        await makeGoodRequest("/lessons?page=10000");
      });

      it("should return a 400 Bad Request for invalid page number", async () => {
        const response = await makeBadRequest("/lessons?page=abc");

        expect(response.body.error).to.contain("Invalid page number");
      });

      it("should return a 400 Bad Request for invalid page number", async () => {
        const response = await makeBadRequest("/lessons?page=0");

        expect(response.body.error).to.contain("Invalid page number");
      });

      it("should return a 400 Bad Request for invalid page number", async () => {
        const response = await makeBadRequest("/lessons?page=-1");

        expect(response.body.error).to.contain("Invalid page number");
      });
    });

    describe("Lessons per page check", () => {
      it("should return an array", async () => {
        await makeGoodRequest("/lessons?lessonsPerPage=10");
      });

      it("should return a 400 Bad Request for invalid lessonsPerPage", async () => {
        const response = await makeBadRequest("/lessons?lessonsPerPage=abc");

        expect(response.body.error).to.contain("Invalid lessonsPerPage");
      });

      it("should return a 400 Bad Request for invalid lessonsPerPage", async () => {
        const response = await makeBadRequest("/lessons?lessonsPerPage=0");

        expect(response.body.error).to.contain("Invalid lessonsPerPage");
      });

      it("should return a 400 Bad Request for invalid lessonsPerPage", async () => {
        const response = await makeBadRequest("/lessons?lessonsPerPage=-1");

        expect(response.body.error).to.contain("Invalid lessonsPerPage");
      });
    });
  });
});
