var Election = artifacts.require("./Election.sol")

contract("Election", function (accounts) {
    var electionInstance;

    it("initialize with two candidates", function () {
        return Election.deployed().then(function (instance) {
            return instance.candidateCount();
        }).then(function (count) {
            assert.equal(count, 2);
        });
    });

    it("initialize two candidates with correct values", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance
            return electionInstance.candidates(0);
        }).then(function (candidate) {
            assert.equal(candidate[0], 0, "contain correct id")
            assert.equal(candidate[1], "Candidate 1", "contain correct name")
            assert.equal(candidate[2], 0, "contain correct count")
            return electionInstance.candidates(1);
        }).then(function (candidate) {
            assert.equal(candidate[0], 1, "contain correct id")
            assert.equal(candidate[1], "Candidate 2", "contain correct name")
            assert.equal(candidate[2], 0, "contain correct count")
        });
    });

    it("allows a voter to cast a vote", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            candidateId = 0;
            return electionInstance.vote(candidateId, { from: accounts[0] });
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
            return electionInstance.voters(accounts[0]);
        }).then(function (voted) {
            assert(voted, "the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            assert.equal(voteCount, 1, "increment candidate's voteCount");
        })
    })

    it("throws an exception for invalid candidate", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            return electionInstance.vote(99, { from: accounts[0] })
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
            return electionInstance.candidates(0);
        }).then(function (candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate1 did not receive any votes");
            return electionInstance.candidates(1);
        }).then(function (candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 0, "candidate2 did not receive any votes");
        })
    })

    it("throws an exception for double vote", function () {
        return Election.deployed().then(function (instance) {
            electionInstance = instance;
            candidateId = 1;
            electionInstance.vote(candidateId, { from: accounts[1] });
            return electionInstance.candidates(candidateId);
        }).then(function (candidate) {
            var voteCount = candidate[2];
            //console.log(voteCount.toNumber());
            assert.equal(voteCount, 1, "accept first vote");
            return electionInstance.vote(candidateId, { from: accounts[1] });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf("revert") >= 0, "error message must contain revert");
            return electionInstance.candidates(0);
        }).then(function (candidate1) {
            var voteCount = candidate1[2];
            assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
            return electionInstance.candidates(1);
        }).then(function (candidate2) {
            var voteCount = candidate2[2];
            assert.equal(voteCount, 1, "candidate 2 did not receive any votes");
        })
    })
});
