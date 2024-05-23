import { configureStore } from '@reduxjs/toolkit'
import register from '../modules/registerSlice'
import userOtp from '../modules/otpSlice'
import loginUser from '../modules/loginSlice'
import forgot from '../modules/forgotSlice'
import resetPassword from '../modules/resetPasswordSlice'
import CreateTask from '../modules/createTasksSlice'
import missionDetail from '../modules/missionDetailUpload'
import missionTask from '../modules/missionTaskSlice'
import missionUploadTask from '../modules/missionTaskUpload'
import missionType from '../modules/missionTypeSlice'
import getDropdown from '../modules/getDropdownMission'
import LeaderboardSlice from '../modules/getLeaderboard'
import missionCount from '../modules/getMissionCount'
import getMission from '../modules/getMissionSlice'
import getMissionTaskSlice from '../modules/getMissionTask'
import getmissionType from '../modules/getMissionTypeSlice'
import getTarget from '../modules/getTargetSlice'
import tasksChecklist from '../modules/getTasksChecklist'
import UserList from '../modules/getUserList'
import getUserMissions from '../modules/getUserMission'
import getUserUpdate from '../modules/getUserUpdate'
import passwordResetOtp from '../modules/forgotOtpSlice'
import confirmSlice from '../modules/confirmPassword'
import  featureMissions  from '../modules/getFeatureMission'
import  friendsList  from '../modules/getFriendList'
import uploadPhotos from '../modules/missionTypeUpload'
import getAdminTask  from '../modules/getAdminTaskSlice'
import  getFeatureAdminTask  from '../modules/featureAdminTaskSlice'
import  searchMission  from '../modules/searchMissionSlice'




export const store = configureStore({
  reducer: {
    registerSlice: register,
    otpSlice: userOtp,
    loginSlice: loginUser,
    forgotSlice: forgot,
    resetPassword: resetPassword,
    createTaskSlice: CreateTask,
    missionDetailUpload: missionDetail,
    missionTaskSlice: missionTask,
    missionTaskUpload: missionUploadTask,
    missionTypeSlice: missionType,
    getDropDownSlice: getDropdown,
    getLeaderBoard: LeaderboardSlice,
    missionCountSlice: missionCount,
    getMissionSlice: getMission,
    getMissionTaskSlice: getMissionTaskSlice,
    missionTypeSLice: getmissionType,
    getTargetSlice: getTarget,
    tasksChecklist: tasksChecklist,
    userListSLice: UserList,
    getUserMission: getUserMissions,
    getUserUpdateSlice: getUserUpdate,
    resetOtp: passwordResetOtp,
    confirmPasswordSlice: confirmSlice,
    featureMission:featureMissions,
    friendsSLice: friendsList,
    uploadPhotosSlice: uploadPhotos,
    getAdminTaskSlice:getAdminTask,
    getFeatureAdminTaskSlice :getFeatureAdminTask,
    searchMissionSlice:searchMission
  },
});