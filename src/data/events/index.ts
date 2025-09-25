/** @format */

import { allianceBrawl } from "./allianceBrawl";
import { allianceMobilization } from "./allianceMobilization";
import { allOut } from "./allOut";
import { armamentCompetition } from "./armamentCompetition";
import { buccaneerBounty } from "./buccaneerBounty";
import { callOfSovereign } from "./callOfSovereign";
import { castleBattle } from "./castleBattle";
import { cesaresFury } from "./cesaresFury";
import { champagneFair } from "./champagneFair";
import { defeatBeasts } from "./defeatBeasts";
import { desertTrial } from "./desertTrial";
import { eternitysReach } from "./eternitysReach";
import { fishingTournament } from "./fishingTournament";
import { goldenGlaives } from "./goldenGlaives";
import { hallOfHeroes } from "./hallOfHeroes";
import { heroRoulette } from "./heroRoulette";
import { kvkBattlePhase, kvkMatchmakingPhase, kvkPreparationPhase } from "./kvk";
import { merchantEmpire } from "./merchantEmpire";
import { mysticDivination } from "./mythicDivination";
import { officerProject } from "./officerProject";
import { strongestGovernor } from "./strongestGovernor";
import { swordlandShowdown } from "./swordlandShowdown";
import { triAllianceClash } from "./triAllianceClash";
import { vikingsVengeance } from "./vikingsVengeance";

export const allEvents = [
    kvkMatchmakingPhase,
    kvkPreparationPhase,
    kvkBattlePhase,
    castleBattle,
    strongestGovernor,
    heroRoulette,

    // * not important to default player
    // allianceChampionship,
    allianceBrawl,
    merchantEmpire,
    allianceMobilization,
    swordlandShowdown,
    triAllianceClash,
    allOut,

    hallOfHeroes,
    goldenGlaives,
    callOfSovereign,
    eternitysReach,
    vikingsVengeance,
    cesaresFury,
    // * add back as soon as next event is scheduled
    // championsWay,

    // * add back as soon as next event is scheduled
    champagneFair,
    mysticDivination,
    fishingTournament,
    buccaneerBounty,

    desertTrial,
    armamentCompetition,
    officerProject,
    defeatBeasts,
] as const;
