export const mockReports = [
  {
    id: 1,
    title: "Report 1",
    description: "This is report 1",
    status: "resolved",
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true,
    createdBy: 1, // Replace with the actual ID of the creator
    validatedBy: null, // Replace with the actual ID of the validator or null if not validated
    resolvedBy: null, // Replace with the actual ID of the resolver or null if not resolved
    category: "road damage", // Replace with the actual category
    location: 1, // Replace with the actual ID of the location
    image_url: null, // Replace with the actual image URL or null if no image
    rating: null, // Replace with the actual rating or null if no rating
  },
  {
    id: 2,
    title: "Report 2",
    description: "This is report 2",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: false,
    createdBy: 2, // Replace with the actual ID of the creator
    validatedBy: null, // Replace with the actual ID of the validator or null if not validated
    resolvedBy: null, // Replace with the actual ID of the resolver or null if not resolved
    category: "street sanitation", // Replace with the actual category
    location: 2, // Replace with the actual ID of the location
    image_url: null, // Replace with the actual image URL or null if no image
    rating: null, // Replace with the actual rating or null if no rating
  },
  // Add more mock reports as needed
];