import { NebiusAdapter } from './nebius';
import { TavilyAdapter } from './tavily';
import { YouAdapter } from './you';
import { NimbleAdapter } from './nimble';
import { InsForgeAdapter } from './insforge';
import { HydraDbAdapter } from './hydradb';
import { RocketRideAdapter } from './rocketride';

export const nebius = new NebiusAdapter();
export const tavily = new TavilyAdapter();
export const you = new YouAdapter();
export const nimble = new NimbleAdapter();
export const insforge = new InsForgeAdapter();
export const hydradb = new HydraDbAdapter();
export const rocketride = new RocketRideAdapter();

export const SponsorRegistry = [
  nebius,
  tavily,
  you,
  nimble,
  insforge,
  hydradb,
  rocketride,
];
