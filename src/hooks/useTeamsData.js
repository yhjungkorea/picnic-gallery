import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

export const useTeamsData = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'teams'));
        const teamsData = [];
        querySnapshot.forEach((doc) => {
          teamsData.push({ id: doc.id, ...doc.data() });
        });
        
        // Fetch photos from Firebase Storage for each team
        const processedTeams = await Promise.all(teamsData.map(async (team) => {
          const teamPhotos = {
            mission1: null,
            mission2: null,
            mission3: null,
            mission4: null,
            mission5: null,
            mission6: null
          };

          try {
            if (team.id) {
              const teamFolderRef = ref(storage, `mission-photos/${team.id}`);
              const res = await listAll(teamFolderRef);
              
              // Map found files to mission IDs based on filename containing 'place-1', 'place-2' etc.
              for (const itemRef of res.items) {
                const url = await getDownloadURL(itemRef);
                const fileName = itemRef.name.toLowerCase();
                
                if (fileName.includes('place-1')) teamPhotos.mission1 = url;
                else if (fileName.includes('place-2')) teamPhotos.mission2 = url;
                else if (fileName.includes('place-3')) teamPhotos.mission3 = url;
                else if (fileName.includes('place-4')) teamPhotos.mission4 = url;
                else if (fileName.includes('place-5')) teamPhotos.mission5 = url;
                else if (fileName.includes('place-6')) teamPhotos.mission6 = url;
              }
            }
          } catch (storageErr) {
            console.error(`Error fetching photos for team ${team.teamName}:`, storageErr);
          }

          return {
            ...team,
            photos: teamPhotos
          };
        }));
        
        setTeams(processedTeams);
      } catch (err) {
        console.error("Error fetching teams data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return { teams, loading, error };
};
