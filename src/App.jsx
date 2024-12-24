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

function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuthenticator((context) => [context.user]); // Get the user object

  useEffect(() => {
    console.log('User object:', user);
    if (user) {
      console.log('User attributes:', user.attributes); // Check for both user
      fetchUserProfile();
    }
  }, [user]); // Add user as dependency

  async function fetchUserProfile() {
    try {
      setIsLoading(true);
      if (!user || !user.attributes || !user.attributes.sub) {
        console.log('User or user attributes not available yet');
        return;
      }

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
    } finally {
      setIsLoading(false);
    }
  }

  // Debug information
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
      <Heading level={2}>Welcome, {user?.attributes?.loginId || 'Guest'}</Heading>

      <Divider />
      
      {isLoading ? (
        <p>Loading profile data...</p>
      ) : userprofiles.length === 0 ? (
        <p>No profile data available</p>
      ) : (
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
      )}
      <Button onClick={signOut}>Sign Out</Button>
    </Flex>
  );
}
export default function AuthWrapper() {
  return (
    <Authenticator>
      <App />
    </Authenticator>
  );
}