import type { IModule } from '../types/module';
import { AutopilotPlusModule } from './autopilot-pp';
import { AutothrottleModule } from './autothrottle';
import { InformationDisplayModule } from './information-display';
import { FuelSimulatorModule } from './fuel-simulator';
import { OverpoweredEnginesModule } from './overpowered-engines';
import { ChecklistSystemModule } from './checklist-system';
import { RealismPackModule } from './realism-pack';
import { FailureSimulatorModule } from './failure-simulator';
import { FlightPathVectorModule } from './flight-path-vector';
import { LandingStatisticsModule } from './landing-statistics';
import { SatelliteImageryModule } from './satellite-imagery';
import { GateSpawnerModule } from './gate-spawner';

export function createBuiltinModules(): IModule[] {
  return [
    new AutothrottleModule(),
    new AutopilotPlusModule(),
    new InformationDisplayModule(),
    new FuelSimulatorModule(),
    new OverpoweredEnginesModule(),
    new ChecklistSystemModule(),
    new RealismPackModule(),
    new FailureSimulatorModule(),
    new FlightPathVectorModule(),
    new LandingStatisticsModule(),
    new SatelliteImageryModule(),
    new GateSpawnerModule()
  ];
}
