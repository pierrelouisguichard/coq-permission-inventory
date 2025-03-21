// Helper function to truncate strings to 10 characters and append ellipsis
const truncateString = (str, maxLength = 24) => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

/**
 * Fetches groups, filters them based on the given prefix, and creates a table showing group memberships.
 * @param {string} accessToken - The access token for MS Graph API.
 * @param {RegExp} groupNamePattern - The regular expression used to filter group names.
 * @returns {Array} - The table showing which members belong to which groups.
 */
export async function fetchGroupMemberships(accessToken, groupNamePattern) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  try {
    // Step 1: Fetch groups
    const groupsResponse = await fetch(graphConfig.groupsEndpoint, options);
    if (!groupsResponse.ok) {
      throw new Error(`Error fetching groups: ${groupsResponse.statusText}`);
    }
    const groups = await groupsResponse.json();

    // Filter groups based on the provided regular expression (e.g., /^grp_\d{2}_/)
    const filteredGroups = groups.value.filter((group) =>
      groupNamePattern.test(group.displayName)
    );

    const groupMembership = new Map(); // Map to store group memberships
    const allMembers = new Set(); // Set to store all unique members

    // Step 2: Fetch members for each group
    for (const group of filteredGroups) {
      const groupName = truncateString(group.displayName); // Truncate group name if longer than 10 characters
      groupMembership.set(groupName, new Set());

      const membersResponse = await fetch(
        `${graphConfig.membersEndpoint}/${group.id}/members`,
        options
      );
      if (!membersResponse.ok) {
        console.error(
          `Error fetching members for group ${groupName}: ${membersResponse.statusText}`
        );
        continue;
      }
      const members = await membersResponse.json();

      const userId = "5a6051dd-e301-4b70-aea0-9b2d0ef14024";
      const userResponse = await fetch(
        `https://graph.microsoft.com/v1.0/users/${userId}?$select=id,displayName,mail,userPrincipalName`,
        options
      );
      const userData = await userResponse.json();
      console.log("Direct User Fetch:", JSON.stringify(userData, null, 2));

      for (const member of members.value) {
        const memberName = truncateString(
          member.displayName || "Unknown Member"
        );
        allMembers.add(memberName);
        groupMembership.get(groupName).add(memberName);
      }
    }

    // Step 3: Create the table
    const groupNames = Array.from(groupMembership.keys());
    const memberNames = Array.from(allMembers);

    // Table Header
    const table = [["User / Group", ...groupNames]];

    // Fill table rows
    memberNames.forEach((memberName) => {
      const row = [memberName];
      groupNames.forEach((groupName) => {
        row.push(groupMembership.get(groupName).has(memberName) ? "X" : "");
      });
      table.push(row);
    });

    // Return table for further use
    return table;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Fetches and logs a table showing which groups (starting with 'grp_svc') are in other groups.
 * @param {string} accessToken - The access token for MS Graph API.
 */
export async function callMsGraphForGrpSvc(accessToken) {
  return await fetchGroupMemberships(accessToken, /^grp_svc/); // Matches groups starting with 'grp_svc'
}

/**
 * Fetches and logs a table showing which groups (starting with 'grp_') are in other groups.
 * @param {string} accessToken - The access token for MS Graph API.
 */
export async function callMsGraph(accessToken) {
  return await fetchGroupMemberships(accessToken, /^grp_\d{2}_/); // Matches grp_ followed by two digits
}

const graphConfig = {
  groupsEndpoint:
    "https://graph.microsoft.com/v1.0/groups?$filter=startswith(displayName,'grp_')",
  membersEndpoint: "https://graph.microsoft.com/v1.0/groups",
};
