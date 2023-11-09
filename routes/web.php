<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\UtilitiesController;
use App\Http\Controllers\AvailableTaskController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\TaskListController;
use App\Http\Controllers\MyTaskController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\CredentialController;
use App\Http\Controllers\PreferenceController;
use App\Http\Controllers\AuditController;
use Illuminate\Support\Facades\Auth;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Auth::routes();
// Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::group(['middleware' => ['auth']], function () {
    Route::get('/token', [UtilitiesController::class, 'token']);
    Route::get('/getLoggedInUsername', [UtilitiesController::class, 'getLoggedInUsername']);
    Route::prefix('api')->group(function () {

        Route::get("credentials/{customer}/populateCredentialsForCustomers",  [CredentialController::class, 'populateCredentialsForCustomers'])->name('credentials.populateCredentialsForCustomers');

        Route::get("customers/populateAvailableCustomersForTaskList",  [CustomerController::class, 'populateAvailableCustomersForTaskList'])->name('customers.populateAvailableCustomersForTaskList');
        Route::post("customers/deleteMany",  [CustomerController::class, 'destroyMany'])->name('customers.destroyMany');
        Route::resource("customers", CustomerController::class);

        Route::put("users/readAnnouncement/{announcementId}",  [UserController::class, 'readAnnouncement'])->name('users.readAnnouncement');
        Route::put("users/unreadAnnouncement/{announcementId}",  [UserController::class, 'unreadAnnouncement'])->name('users.unreadAnnouncement');
        Route::put("users/deleteAnnouncement/{announcementId}",  [UserController::class, 'deleteAnnouncement'])->name('users.deleteAnnouncement');
        Route::put("users/deleteAnnouncements",  [UserController::class, 'deleteAnnouncements'])->name('users.deleteAnnouncements');
        Route::get("users/populateUsersForTaskList",  [UserController::class, 'populateUsersForTaskList'])->name('users.populateUsersForTaskList');
        Route::get("users/role",  [UserController::class, 'role'])->name('users.role');
        Route::post("users/deleteMany",  [UserController::class, 'destroyMany'])->name('users.destroyMany');
        Route::put("users/{user}/changePassword", [UserController::class, 'changePassword'])->name('users.changePassword');
        Route::resource("users", UserController::class);

        Route::get("availableTasks/populateAvalableTasksForTaskList",  [AvailableTaskController::class, 'populateAvalableTasksForTaskList'])->name('availableTasks.populateAvalableTasksForTaskList');
        Route::post("availableTasks/deleteMany",  [AvailableTaskController::class, 'destroyMany'])->name('availableTasks.destroyMany');
        Route::resource("availableTasks", AvailableTaskController::class);

	Route::post("customers/saveImageFile",  [CustomerController::class, 'saveImageFile'])->name('customers.saveImageFile');


        Route::get("announcements/{announcement}/populateThisAnnouncementDetails",  [AnnouncementController::class, 'populateThisAnnouncementDetails'])->name('announcements.populateThisAnnouncementDetails');
        Route::get("announcements/getSentAnnouncements",  [AnnouncementController::class, 'getSentAnnouncements'])->name('announcements.getSentAnnouncements');
        Route::post("announcements/saveImageFile",  [AnnouncementController::class, 'saveImageFile'])->name('announcements.saveImageFile');
        Route::post("announcements/deleteMany",  [AnnouncementController::class, 'destroyMany'])->name('announcements.destroyMany');
        Route::resource("announcements", AnnouncementController::class);

        Route::post("taskLists/deleteMany",  [TaskListController::class, 'destroyMany'])->name('taskLists.destroyMany');
        Route::resource("taskLists", TaskListController::class);

        Route::put("myTasks/updateMinutes/{myTask}",  [MyTaskController::class, 'updateMinutes'])->name('myTasks.updateMinutes');
        Route::put("myTasks/updateStatus/{myTask}",  [MyTaskController::class, 'updateStatus'])->name('myTasks.updateStatus');
        Route::post("myTasks/setStatusForMany",  [MyTaskController::class, 'setStatusForMany'])->name('myTasks.setStatusForMany');
        Route::resource("myTasks", MyTaskController::class);

        Route::get('events/getTaskId/{event}',  [EventController::class, 'getTaskId'])->name('events.getTaskId');
        Route::resource('events', EventController::class);

        Route::resource("preferences", PreferenceController::class);

        Route::resource('audits', AuditController::class);
    });
    Route::view('/{path?}', 'reactApp')->where('path', '.*')->name('reactApp');
});
