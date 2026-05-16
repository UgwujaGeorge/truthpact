export const truthPactAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "pactId", type: "uint256" },
      { indexed: true, internalType: "address", name: "client", type: "address" },
      { indexed: true, internalType: "address", name: "worker", type: "address" },
      { indexed: false, internalType: "address", name: "judge", type: "address" },
      { indexed: false, internalType: "uint256", name: "escrowAmount", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "deadline", type: "uint256" }
    ],
    name: "PactCreated",
    type: "event"
  },
  {
    inputs: [
      { internalType: "address", name: "worker", type: "address" },
      { internalType: "address", name: "judge", type: "address" },
      { internalType: "string", name: "prompt", type: "string" },
      { internalType: "uint256", name: "escrowAmount", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" }
    ],
    name: "createPact",
    outputs: [{ internalType: "uint256", name: "pactId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "pactId", type: "uint256" }],
    name: "fundPact",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "pactId", type: "uint256" }],
    name: "approvePact",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "pactId", type: "uint256" }],
    name: "rejectPact",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "pactId", type: "uint256" }],
    name: "refundExpiredPact",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "pactId", type: "uint256" },
      { internalType: "string", name: "workURI", type: "string" },
      { internalType: "string", name: "workText", type: "string" }
    ],
    name: "submitWork",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "pactId", type: "uint256" }],
    name: "getPact",
    outputs: [
      {
        components: [
          { internalType: "address", name: "client", type: "address" },
          { internalType: "address", name: "worker", type: "address" },
          { internalType: "address", name: "judge", type: "address" },
          { internalType: "string", name: "prompt", type: "string" },
          { internalType: "uint256", name: "escrowAmount", type: "uint256" },
          { internalType: "uint256", name: "deadline", type: "uint256" },
          { internalType: "string", name: "workURI", type: "string" },
          { internalType: "string", name: "workText", type: "string" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "judgedAt", type: "uint256" }
        ],
        internalType: "struct TruthPact.Pact",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "pactCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;
