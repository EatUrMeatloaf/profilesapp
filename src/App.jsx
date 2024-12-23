import { useState, useEffect } from "react";
import {
  Button,
  Heading,
  Flex,
  View,
  Grid,
  Divider,
} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const { user, signOut } = useAuthenticator((context) => [context.user]); // Get the user object

  useEffect(() => {
    if (user) { // Only fetch if we have a user
      fetchUserProfile();
    }
  }, [user]); // Add user as dependency

  async function fetchUserProfile() {
    try {
      // Filter to only get the current user's profile
      const { data: profiles } = await client.models.UserProfile.list({
        filter: {
          profileOwner: {
            eq: `${user.attributes.sub}::${user.username}`
          }
        }
      });
      setUserProfiles(profiles);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }

  // You can also add debug information to see what's happening
  console.log('Current user:', user);
  console.log('User profiles:', userprofiles);
  console.log('User attributes:', user?.attributes);

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My Profile</Heading>
      {/* Add this to show the current user's username */}
      <Heading level={2}>Welcome, {user?.attributes?.email}</Heading>

      <Divider />

      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="1px solid #ccc"
            padding="2rem"
            borderRadius="5%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}