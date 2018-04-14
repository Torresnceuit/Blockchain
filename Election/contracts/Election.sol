pragma solidity ^0.4.16;

contract Election {
    // Model the candidate
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Store accounts that vote
    mapping(address => bool) public voters;

    // Fetch candidates
    mapping (uint => Candidate) public candidates;
    // Store candidate count
    uint public candidateCount;
    // Constructor

    function Election() public {  
        addCandidate("Candidate 1");   
        addCandidate("Candidate 2");
          
    }

    // Add candidate
    function addCandidate(string _name) private {
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
        candidateCount++;   
        
    }

    // vote
    function vote(uint _candidateId) public{
        // require they have not voted before
        require(!voters[msg.sender]);
        // require a valid candidate
        require(_candidateId >= 0 && _candidateId < candidateCount);
        // store voted accounts
        voters[msg.sender] = true;
        // update voteCount
        candidates[_candidateId].voteCount++;
        // trigger voted event
        votedEvent(_candidateId);
    }

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );
}