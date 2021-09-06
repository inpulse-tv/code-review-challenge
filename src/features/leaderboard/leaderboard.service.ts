import { ILeaderboard } from "../../datas/ILeaderboard";
import lbDatas from "../../datas/leaderboard.json";

/**
 * Manage leaderboard data on local storage.
 */
export default class LeaderboardService {
  // Default user data object.
  userInit: ILeaderboard = {
    pseudo: "",
    email: null,
    score: 0,
    millisecs: 0,
    time: "",
  };

  private leaderboardData: ILeaderboard[] = [];

  /**
   * Save user data in leaderboard and localStorage and return
   * the new leaderboard.
   * @param user User data object.
   * @returns the updated leaderboard.
   */
  save = (user: ILeaderboard): ILeaderboard[] => {
    // Check if user exist.
    const index = this.leaderboardData.findIndex(
      (item) =>
        item.pseudo?.toString().toUpperCase() ===
        user.pseudo?.toString().toUpperCase()
    );
    if (index > -1) {
      const currentData = this.leaderboardData[index];

      // Check result.
      if (currentData.score > user.score) return this.leaderboardData;
      if (
        currentData.score === user.score &&
        currentData.millisecs > user.millisecs
      )
        return this.leaderboardData;

      // Update user.
      this.leaderboardData[index] = {
        pseudo: user.pseudo,
        email: user.email,
        millisecs: user.millisecs,
        score: user.score,
        time: user.time,
      };
    } else {
      // Add user.
      this.leaderboardData = [...this.leaderboardData, user];
    }

    localStorage.setItem("leaderboard", JSON.stringify(this.leaderboardData));
    return this.leaderboardData;
  };

  /**
   * Get a Leaderboard object from local storage or json import if empty.
   * @returns The leaderboard data.
   */
  load = (): ILeaderboard[] => {
    try {
      const s = localStorage.getItem("leaderboard");
      this.leaderboardData = (s === null) ? lbDatas : JSON.parse(s);
      return this.leaderboardData;
    } catch (e) {
      return lbDatas;
    }
  };
}
