1. admin > all workspaces > permission.
  1. update overall ui
  2. add a btn: permit full permission at top right
  3. the listings should be section wise. since they are fixed resource. it should not be issue
    1. each section should be naming and proper spacing between each section for ui separation
    2. we will have checkbox for all the items and section header should have select all checkbox. selecting this checkbox would select all the checbox within this section
    3. we can batch select items and click a confirm permission (which would be at bottom) and update batch permissions
    4. right now, clicking one item update one permission. it cause the list re-rendering. and the ui and ux all weird and messy and unfriendly. we need to fix this
2. fix authorization toast not appearing
  1. when we superadmin dont permit workspace admin to view projects perm.
  2. and the workspace admin went ahead to project listings
  3. currently, we are redirecting the user to homepage (/) and 
  4. we have toast message setup. but unless user refresh, they dont see anything
  5. so, basically this is what is happening: user redirect to homepage (because of no permission) and nothing else is shown. and when he refresh the page, he see 2 copy of same toast message
  6. the FIX: we wont redirect the user to homepage. rather we will show a new page ui: "403 you are not authorized to view project now. please contact with superadmin to get permission" this will be our new page ui. no more redirect. no more toast. remove all of those
  7. the above example scenario (for project listings view) was explained for only one operation. i want this same activity for all of the other workspace resources. same behavior: they try to view or perform something, they dont have permission for. and then we will show 403 authorization err. check out all the workspace permissions apply this behavior for all of those resources.
3. update our landing homepage with: "why you should choose us" section. and fill up the content with production like. match existing ui and add icons and stuffs and make it beautiful
4. workspace should be soft-delete at the front. and we will never delete it from backend

