import {
  // Contains,
  // IsDate,
  IsEnum,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  // validateSync,
  // ValidationError,
} from 'class-validator';

import { TeamColor } from './enums';

export interface TeamMember {
  // public details about each team member
  name: string;
  id: string;
  // TODO store more from firebase?
}

interface TeamDataInput {
  // team data storage block
  teamColor: TeamColor;
  teamName?: string;
  // TODO, omit in favor of CSV stringify from teamMembers
  teamMemberNames?: string;
  teamMembers?: TeamMember[];
  words?: string[]; // should be exactly 4
}

export class TeamData {
  @IsEnum(TeamColor)
  public teamColor: TeamColor;
  public teamName: string;
  public teamMemberNames: string;
  @ArrayMinSize(2, { message: 'You need at least 2 players per team.' })
  @ArrayMaxSize(10, { message: 'With 10 players on a team, it is too crazy.' })
  public teamMembers: TeamMember[];
  @ArrayMinSize(4, { message: 'You need 4 words for each team.' })
  @ArrayMaxSize(4, { message: 'You need 4 words for each team.' })
  @MinLength(3, {
    message: 'Each word needs to be at least 3 letters.',
    each: true,
  })
  @MaxLength(30, {
    message: 'Each word should be no more than 30 letters.',
    each: true,
  })
  public words: string[]; // should be exactly 4

  constructor(data: TeamDataInput) {
    this.teamColor = data.teamColor || 'WHITE';
    this.teamName = data.teamName || '';
    this.teamMemberNames = data.teamMemberNames || '';
    this.teamMembers = data.teamMembers || [];
    this.words = data.words || [];
  }
}
