import { useState, useEffect, useMemo } from 'react';
import { useTitle } from 'react-use';
import { useUserInfo } from '../context/userInfoContext';
import playerList from '../components/profiles/playerList.json';

const PlayerProfile = () => {
  useTitle('Player Profile');
  const { userInfo } = useUserInfo();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedPlayerId, setSelectedPlayerId] = useState('cameronCardwell');
  const [playerData, setPlayerData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    position: '',
    homeCity: '',
    number: '',
    experience: '',
  });

  useEffect(() => {
    const loadPlayerData = async () => {
      try {
        const data = await import(
          `../components/profiles/${selectedPlayerId}.json`
        );
        setPlayerData(data.default);
      } catch (error) {
        console.error('Failed to load player data', error);
      }
    };

    loadPlayerData();
  }, [selectedPlayerId]);

  useEffect(() => {
    if (playerData) {
      setEditForm({
        firstName: playerData.firstName,
        lastName: playerData.lastName,
        position: playerData.position,
        homeCity: playerData.homeCity,
        number: playerData.number,
        experience: playerData.experience,
      });
    }
  }, [playerData]);

  const handleSave = () => {
    setPlayerData({ ...playerData, ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert form to current data
    setEditForm({
      firstName: playerData.firstName,
      lastName: playerData.lastName,
      position: playerData.position,
      homeCity: playerData.homeCity,
      number: playerData.number,
      experience: playerData.experience,
    });
  };

  const derivedStats = useMemo(() => {
    if (!playerData) return null;
    const results = playerData.tournamentResults || [];

    const getBestPlacement = (res: any[]) => {
      if (!res.length) return '-';
      // Sort by placement (assuming "1st", "2nd" format, parsing integer works)
      const sorted = [...res].sort(
        (a, b) =>
          (parseInt(a.placement) || 999) - (parseInt(b.placement) || 999),
      );
      return sorted[0].placement;
    };

    // Season Stats (2025)
    const seasonResults = results.filter((r: any) => r.year === '2025');
    const seasonStats = {
      tournaments: seasonResults.length,
      wins: seasonResults.reduce(
        (acc: number, r: any) => acc + (r.wins || 0),
        0,
      ),
      losses: seasonResults.reduce(
        (acc: number, r: any) => acc + (r.losses || 0),
        0,
      ),
      bestPlacement: getBestPlacement(seasonResults),
    };

    // Lifetime Stats
    const lifetimeStats = {
      wins: results.reduce((acc: number, r: any) => acc + (r.wins || 0), 0),
      losses: results.reduce((acc: number, r: any) => acc + (r.losses || 0), 0),
      bestPlacement: getBestPlacement(results),
      netPoints: results.reduce(
        (acc: number, r: any) => acc + ((r.pf || 0) - (r.pa || 0)),
        0,
      ),
    };

    // Recent Tournaments (Sort by date desc)
    const recentTournaments = [...results]
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
      .map((r: any) => ({
        name: r.tournament,
        city: r.city,
        date: r.date,
        team: r.team,
        placement: r.placement,
      }));

    return { seasonStats, lifetimeStats, recentTournaments };
  }, [playerData]);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header Section */}
      <div className="bg-white shadow relative">
        {/* Player Selector */}
        <div className="absolute top-4 left-4 z-50">
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="p-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
          >
            {playerList.map((player: any) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* Top Banner */}
        <div className="h-40 bg-gradient-to-r from-gray-900 to-gray-800 relative">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
          {userInfo?.isAdmin && (
            <div className="absolute top-4 right-4 z-50">
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm font-bold"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow text-sm font-bold"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded shadow text-sm font-bold"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {/* Profile Content */}
        {playerData ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex flex-col md:flex-row items-end -mt-16 pb-6">
              {/* Profile Picture */}
              <div className="relative z-10">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-full ring-4 ring-white bg-white overflow-hidden shadow-lg">
                  <img
                    src={playerData.profilePicture}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              {/* Player Info */}
              <div className="mt-4 md:mt-0 md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between">
                  <div>
                    {isEditing ? (
                      <div className="flex gap-2 mb-2">
                        <input
                          value={editForm.firstName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              firstName: e.target.value,
                            })
                          }
                          className="text-3xl md:text-5xl font-black text-gray-500 uppercase tracking-tight bg-white border border-gray-300 rounded px-2 w-full md:w-auto"
                          placeholder="First Name"
                        />
                        <input
                          value={editForm.lastName}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              lastName: e.target.value,
                            })
                          }
                          className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight bg-white border border-gray-300 rounded px-2 w-full md:w-auto"
                          placeholder="Last Name"
                        />
                      </div>
                    ) : (
                      <h1 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight">
                        <span className="text-gray-500 font-bold">
                          {' '}
                          {playerData.firstName}{' '}
                        </span>{' '}
                        {playerData.lastName}
                      </h1>
                    )}

                    <div className="mt-1 flex items-center text-sm md:text-base font-medium text-gray-600 uppercase tracking-wide space-x-4">
                      {isEditing ? (
                        <div className="flex items-center gap-4 flex-wrap">
                          <select
                            value={editForm.position}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                position: e.target.value,
                              })
                            }
                            className="border border-gray-300 rounded p-1 text-sm"
                          >
                            <option value="Rear Guard">Rear Guard</option>
                            <option value="Forward">Forward</option>
                            <option value="Centerback">Centerback</option>
                            <option value="Flex">Flex</option>
                          </select>
                          <input
                            value={editForm.homeCity}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                homeCity: e.target.value,
                              })
                            }
                            className="border border-gray-300 rounded p-1 w-32"
                            placeholder="City"
                          />
                          <input
                            value={editForm.number}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                number: e.target.value,
                              })
                            }
                            className="border border-gray-300 rounded p-1 w-16"
                            placeholder="#"
                          />
                          <input
                            value={editForm.experience}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                experience: e.target.value,
                              })
                            }
                            className="border border-gray-300 rounded p-1 w-24"
                            placeholder="Exp"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center">
                            <img
                              src={`/images/logos/${playerData.position}.png`}
                              alt={playerData.position}
                              className="h-6 w-6 mr-2"
                            />
                            <span className="text-orange-600 font-bold">
                              {playerData.position}
                            </span>
                          </div>
                          <span className="text-gray-300">|</span>
                          <span>{playerData.homeCity}</span>
                          <span className="text-gray-300">|</span>
                          <span>#{playerData.number}</span>
                          <span className="text-gray-300">|</span>
                          <span>{playerData.experience}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Team/League Logo Placeholder */}
                  <div className="hidden md:block opacity-20">
                    <span className="text-4xl font-black text-gray-400">
                      ICAA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-8 border-t border-gray-200 mt-2">
              {['Overview', 'Tournament Results', 'Stats'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-bold text-sm uppercase tracking-wider ${
                    activeTab === tab
                      ? 'border-orange-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-500">
            Loading profile...
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      {playerData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Stats/Game Log */}
              <div className="lg:col-span-2 space-y-6">
                {/* Season Stats Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">
                      2025 - '26 Season Results
                    </h3>
                  </div>
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {derivedStats?.seasonStats.tournaments}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Tournaments
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {derivedStats?.seasonStats.wins}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Wins
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {derivedStats?.seasonStats.losses}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Losses
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-gray-900">
                        {derivedStats?.seasonStats.bestPlacement}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Best Placement
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Tournaments */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">
                      Recent Tournaments
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                        <tr>
                          <th className="px-6 py-3">Tournament</th>
                          <th className="px-6 py-3">City</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Team</th>
                          <th className="px-6 py-3">Placement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {derivedStats?.recentTournaments.map(
                          (tournament: any, index: number) => (
                            <tr key={index}>
                              <td className="px-6 py-4 font-medium text-gray-900">
                                {tournament.name}
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                {tournament.city}
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                {tournament.date}
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                {tournament.team}
                              </td>
                              <td className="px-6 py-4 font-bold text-gray-900">
                                {tournament.placement}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: All Time Results */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">
                      Lifetime Results
                    </h3>
                  </div>
                  <div className="p-6 space-y-6 text-center">
                    <div>
                      <div className="text-4xl font-black text-gray-900">
                        {derivedStats?.lifetimeStats.wins}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Wins
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-gray-900">
                        {derivedStats?.lifetimeStats.losses}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Losses
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-gray-900">
                        {derivedStats?.lifetimeStats.netPoints}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Net Points
                      </div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-gray-900">
                        {derivedStats?.lifetimeStats.bestPlacement}
                      </div>
                      <div className="text-xs font-bold text-gray-500 uppercase mt-1">
                        Best Placement
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Stats' && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                Stats to be implemented in the future
              </h3>
            </div>
          )}

          {activeTab === 'Tournament Results' && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">
                  Tournament Results
                </h3>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="ml-4 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="All">All Years</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="px-6 py-3 whitespace-nowrap">
                        Tournament
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap">City</th>
                      <th className="px-6 py-3 whitespace-nowrap">Date</th>
                      <th className="px-6 py-3 whitespace-nowrap">Team</th>
                      <th className="px-6 py-3 whitespace-nowrap">W</th>
                      <th className="px-6 py-3 whitespace-nowrap">L</th>
                      <th className="px-6 py-3 whitespace-nowrap">PF</th>
                      <th className="px-6 py-3 whitespace-nowrap">PA</th>
                      <th className="px-6 py-3 whitespace-nowrap">Net</th>
                      <th className="px-6 py-3 whitespace-nowrap">Placement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {playerData.tournamentResults
                      .filter(
                        (t: any) =>
                          selectedYear === 'All' || t.year === selectedYear,
                      )
                      .sort(
                        (a: any, b: any) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((result: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {result.tournament}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.city}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.date}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.team}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.wins}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.losses}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.pf}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {result.pa}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {(result.pf || 0) - (result.pa || 0)}
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            {result.placement}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerProfile;
