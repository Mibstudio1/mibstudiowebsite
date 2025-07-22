import { NewRoom, Room } from "./timeline";

export interface AddRoomFormProps {
  newRoom: NewRoom;
  setNewRoom: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: "indoor" | "outdoor" | "pool" | "bathroom";
      width: number;
      height: number;
      pricePerSqm?: number;
    }>
  >;
  addRoom: () => void;
}

export interface CostSummaryProps {
  rooms: Room[];
  totalArea: number;
  totalConstructionCost: number;
  designFee: number;
  grandTotal: number;
  mibCost: string;
  hasMultipleBuildings: boolean;
  additionalBuildingCount: number;
  additionalBuildingCost: number;
  onMultipleBuildingsChange?: (checked: boolean) => void;
  onAdditionalBuildingCountChange?: (count: number) => void;
}

export interface FloorPlanProps {
  rooms: Room[];
  calculateRoomDisplaySize: (room: Room) => {
    displayWidth: number;
    displayHeight: number;
  };
  draggedRoom: number | null;
  handlePointerDown: (e: React.PointerEvent, roomId: number) => void;
}

export interface RoomListProps {
  rooms: Room[];
  deleteRoom: (id: number) => void;
}

export interface BuildingCost {
  rooms: Room[];
  totalArea: number;
  totalConstructionCost: number;
  designFee: number;
  grandTotal: number;
  hasMultipleBuildings: boolean;
  additionalBuildingCount: number;
  additionalBuildingCost: number;
}
