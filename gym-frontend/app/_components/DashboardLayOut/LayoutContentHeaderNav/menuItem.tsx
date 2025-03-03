import Person4RoundedIcon from "@mui/icons-material/Person4Rounded"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import type { MenuProps } from "antd"
type MenuItem = Required<MenuProps>["items"][number]

interface MenuItems {
	[key: number]: MenuItem[]
}
const enum MenuType {
	bookingItems,
}

const bookingItems: MenuItem[] = [
	{
		label: "Common",
		key: "/common",
		icon: <FitnessCenterIcon />,
	},
	{
		label: "Personal Training",
		key: "/personal",
		icon: <Person4RoundedIcon />,
		children: [
			{
				type: "group",
				label: "Item 1",
				children: [
					{ label: "Option 1", key: "/setting1" },
					{ label: "Option 2", key: "/setting2" },
				],
			},
			{
				type: "group",
				label: "Item 2",
				children: [
					{ label: "Option 3", key: "/setting3" },
					{ label: "Option 4", key: "/setting4" },
				],
			},
		],
	},
]

const menuItems: MenuItems = {
	0: bookingItems,
}

export { menuItems, MenuType }
